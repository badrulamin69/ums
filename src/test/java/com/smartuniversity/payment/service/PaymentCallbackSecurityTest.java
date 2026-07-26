package com.smartuniversity.payment.service;

import com.smartuniversity.common.enums.PaymentType;
import com.smartuniversity.payment.entity.Payment;
import com.smartuniversity.payment.repository.PaymentRepository;
import com.smartuniversity.security.entity.User;
import com.smartuniversity.security.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentCallbackSecurityTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SslCommerzService sslCommerzService;

    @InjectMocks
    private PaymentService paymentService;

    private Payment payment;

    @BeforeEach
    void setUp() {
        User user = User.builder()
                .id(1L)
                .email("test@smart.edu")
                .password("encoded")
                .enabled(true)
                .accountNonLocked(true)
                .roles(Set.of())
                .build();

        payment = Payment.builder()
                .id(1L)
                .transactionId("TXN-ABC123456DEF")
                .paymentType(PaymentType.ADMISSION_FEE)
                .referenceEntityType("Applicant")
                .referenceEntityId(1L)
                .user(user)
                .amount(BigDecimal.valueOf(5000))
                .currency("BDT")
                .status("INITIATED")
                .build();
    }

    @Test
    void handleCallback_shouldMarkAsCompletedWhenSignatureIsValid() {
        when(paymentRepository.findByTransactionId("TXN-ABC123456DEF")).thenReturn(Optional.of(payment));
        when(sslCommerzService.validateSignature("val-123", "5000", "BDT")).thenReturn(true);
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        var response = paymentService.handleCallback("TXN-ABC123456DEF", "SUCCESS", "val-123", "5000", "BDT");

        assertEquals("COMPLETED", response.getStatus());
        assertNotNull(response.getPaidAt());
        verify(sslCommerzService).validateSignature("val-123", "5000", "BDT");
    }

    @Test
    void handleCallback_shouldMarkAsFailedWhenSignatureIsInvalid() {
        when(paymentRepository.findByTransactionId("TXN-ABC123456DEF")).thenReturn(Optional.of(payment));
        when(sslCommerzService.validateSignature("val-123", "5000", "BDT")).thenReturn(false);
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        var response = paymentService.handleCallback("TXN-ABC123456DEF", "SUCCESS", "val-123", "5000", "BDT");

        assertEquals("FAILED", response.getStatus());
        assertNull(response.getPaidAt());
    }

    @Test
    void handleCallback_shouldMarkAsFailedWhenStatusIsNotSuccess() {
        when(paymentRepository.findByTransactionId("TXN-ABC123456DEF")).thenReturn(Optional.of(payment));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        var response = paymentService.handleCallback("TXN-ABC123456DEF", "FAILED", null, null, null);

        assertEquals("FAILED", response.getStatus());
        assertNull(response.getPaidAt());
        verifyNoInteractions(sslCommerzService);
    }

    @Test
    void handleCallback_shouldMarkAsFailedWhenStatusIsCancelled() {
        when(paymentRepository.findByTransactionId("TXN-ABC123456DEF")).thenReturn(Optional.of(payment));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        var response = paymentService.handleCallback("TXN-ABC123456DEF", "CANCELLED", null, null, null);

        assertEquals("FAILED", response.getStatus());
        verifyNoInteractions(sslCommerzService);
    }

    @Test
    void handleCallback_shouldMarkAsFailedWhenSignatureValidationThrows() {
        when(paymentRepository.findByTransactionId("TXN-ABC123456DEF")).thenReturn(Optional.of(payment));
        when(sslCommerzService.validateSignature("val-123", "5000", "BDT"))
                .thenThrow(new RuntimeException("SSLCommerz unreachable"));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        var response = paymentService.handleCallback("TXN-ABC123456DEF", "SUCCESS", "val-123", "5000", "BDT");

        assertEquals("FAILED", response.getStatus());
    }
}
