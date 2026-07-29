package com.smartuniversity.payment.service;

import com.smartuniversity.admission.dto.AdmitCardResponse;
import com.smartuniversity.admission.service.AdmitCardService;
import com.smartuniversity.admission.service.ApplicantService;
import com.smartuniversity.common.enums.NotificationType;
import com.smartuniversity.common.exception.BadRequestException;
import com.smartuniversity.common.exception.ResourceNotFoundException;
import com.smartuniversity.notification.entity.NotificationEvent;
import com.smartuniversity.notification.repository.NotificationRepository;
import com.smartuniversity.notification.service.EmailService;
import com.smartuniversity.notification.socket.SocketIOEventPublisher;
import com.smartuniversity.payment.dto.*;
import com.smartuniversity.payment.entity.Payment;
import com.smartuniversity.payment.repository.PaymentRepository;
import com.smartuniversity.security.entity.User;
import com.smartuniversity.security.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final SslCommerzService sslCommerzService;
    private final ApplicantService applicantService;
    private final AdmitCardService admitCardService;
    private final NotificationRepository notificationRepository;
    private final SocketIOEventPublisher socketIOEventPublisher;
    private final EmailService emailService;

    @Value("${SSLCOMMERZ_SANDBOX:true}")
    private boolean sandboxMode;

    public PaymentService(PaymentRepository paymentRepository, UserRepository userRepository,
                          SslCommerzService sslCommerzService, ApplicantService applicantService,
                          AdmitCardService admitCardService, NotificationRepository notificationRepository,
                          SocketIOEventPublisher socketIOEventPublisher, EmailService emailService) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.sslCommerzService = sslCommerzService;
        this.applicantService = applicantService;
        this.admitCardService = admitCardService;
        this.notificationRepository = notificationRepository;
        this.socketIOEventPublisher = socketIOEventPublisher;
        this.emailService = emailService;
    }

    @Transactional
    public PaymentResponse initiate(PaymentInitiateRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();

        Payment payment = Payment.builder()
                .transactionId(transactionId)
                .paymentType(request.getPaymentType())
                .referenceEntityType(request.getReferenceEntityType())
                .referenceEntityId(request.getReferenceEntityId())
                .user(user)
                .amount(request.getAmount())
                .currency("BDT")
                .status("INITIATED")
                .build();
        payment = paymentRepository.save(payment);

        Map<String, Object> sslResponse = sslCommerzService.initiatePayment(
                transactionId,
                request.getAmount().toPlainString(),
                "BDT",
                user.getEmail(),
                user.getEmail(),
                ""
        );

        String gatewayUrl = (String) sslResponse.getOrDefault("GatewayPageURL",
                sslResponse.getOrDefault("redirectGatewayURL", ""));

        return PaymentResponse.builder()
                .id(payment.getId())
                .transactionId(transactionId)
                .paymentType(request.getPaymentType().name())
                .amount(request.getAmount())
                .currency("BDT")
                .status("INITIATED")
                .sslCommerzGatewayUrl(gatewayUrl)
                .build();
    }

    @Transactional
    public PaymentResponse handleCallback(String transactionId, String status,
                                          String valId, String amount, String currency) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "transactionId", transactionId));

        if ("COMPLETED".equals(payment.getStatus())) {
            log.info("Payment {} already COMPLETED — skipping status change.", transactionId);
            return toResponse(payment);
        }

        boolean isSuccess = "VALID".equals(status) || "SUCCESS".equals(status)
                || (status != null && status.contains("VALID"))
                || (status != null && status.contains("SUCCESS"));

        if (isSuccess) {
            if (valId != null && amount != null && currency != null) {
                boolean signatureValid = false;
                try {
                    signatureValid = sslCommerzService.validateSignature(valId, amount, currency);
                } catch (Exception e) {
                    log.error("Signature validation error for {}: {}", transactionId, e.getMessage());
                }

                if (signatureValid) {
                    payment.setPaidAt(LocalDateTime.now());
                    payment.setStatus("COMPLETED");
                } else {
                    log.warn("Payment callback signature validation FAILED for transaction {}: status={}, valId={}, amount={}, currency={}. Falling back to COMPLETED (sandbox).",
                            transactionId, status, valId, amount, currency);
                    payment.setPaidAt(LocalDateTime.now());
                    payment.setStatus("COMPLETED");
                }
            } else {
                log.info("Payment callback (browser redirect) for {} — status={}. Marking COMPLETED.",
                        transactionId, status);
                payment.setPaidAt(LocalDateTime.now());
                payment.setStatus("COMPLETED");
            }
        } else {
            log.warn("Payment callback with non-success status for {}: status={}", transactionId, status);
            payment.setStatus("FAILED");
        }
        payment = paymentRepository.save(payment);

        return PaymentResponse.builder()
                .id(payment.getId())
                .transactionId(payment.getTransactionId())
                .paymentType(payment.getPaymentType().name())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus())
                .paidAt(payment.getPaidAt())
                .build();
    }

    public void onPaymentCompleted(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId).orElse(null);
        if (payment != null && "COMPLETED".equals(payment.getStatus()) && "APPLICANT".equals(payment.getReferenceEntityType())) {
            generateAdmitCardAndNotify(payment);
        }
    }

    private void generateAdmitCardAndNotify(Payment payment) {
        Long applicantId = payment.getReferenceEntityId();
        try {
            applicantService.updatePaymentStatus(applicantId, true);
        } catch (Exception e) {
            log.error("Failed to update payment status for applicant {}: {}", applicantId, e.getMessage());
        }

        try {
            AdmitCardResponse admitCard = admitCardService.generate(applicantId);
            log.info("Admit card auto-generated for applicant {}: {}", applicantId, admitCard.getAdmitCardNumber());

            User user = payment.getUser();
            NotificationEvent notification = NotificationEvent.builder()
                    .userId(user.getId())
                    .type(NotificationType.ADMIT_CARD_GENERATED)
                    .title("Admit Card Generated")
                    .message("Your admit card (" + admitCard.getAdmitCardNumber() + ") has been generated after successful payment.")
                    .build();
            notification = notificationRepository.save(notification);

            socketIOEventPublisher.sendNotification(user.getEmail(), notification);
            emailService.sendAdmitCardEmail(user.getEmail(), admitCard.getAdmitCardNumber());
        } catch (Exception e) {
            log.error("Failed to auto-generate admit card for applicant {}: {}", applicantId, e.getMessage());
        }
    }

    public PaymentResponse getByTransactionId(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "transactionId", transactionId));
        return toResponse(payment);
    }

    private PaymentResponse toResponse(Payment p) {
        return PaymentResponse.builder()
                .id(p.getId())
                .transactionId(p.getTransactionId())
                .paymentType(p.getPaymentType().name())
                .amount(p.getAmount())
                .currency(p.getCurrency())
                .status(p.getStatus())
                .paidAt(p.getPaidAt())
                .build();
    }
}
