package com.smartuniversity.payment.service;

import com.smartuniversity.common.exception.BadRequestException;
import com.smartuniversity.common.exception.ResourceNotFoundException;
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
import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final SslCommerzService sslCommerzService;

    @Value("${SSLCOMMERZ_SANDBOX:true}")
    private boolean sandboxMode;

    public PaymentService(PaymentRepository paymentRepository, UserRepository userRepository,
                          SslCommerzService sslCommerzService) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.sslCommerzService = sslCommerzService;
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

        String gatewayUrl = sandboxMode
                ? "https://sandbox.sslcommerz.com/gwprocess/v3/process.php"
                : "https://securepay.sslcommerz.com/gwprocess/v3/process.php";

        return PaymentResponse.builder()
                .id(payment.getId())
                .transactionId(transactionId)
                .paymentType(request.getPaymentType().name())
                .amount(request.getAmount())
                .currency("BDT")
                .status("INITIATED")
                .sslCommerzGatewayUrl(gatewayUrl + "?token=" + transactionId)
                .build();
    }

    @Transactional
    public PaymentResponse handleCallback(String transactionId, String status,
                                          String valId, String amount, String currency) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "transactionId", transactionId));

        if ("VALID".equals(status) || "SUCCESS".equals(status)) {
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
                log.warn("Payment callback signature validation FAILED for transaction {}: status={}, valId={}, amount={}, currency={}",
                        transactionId, status, valId, amount, currency);
                payment.setStatus("FAILED");
            }
        } else {
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
