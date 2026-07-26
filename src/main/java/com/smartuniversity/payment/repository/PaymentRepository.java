package com.smartuniversity.payment.repository;

import com.smartuniversity.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTransactionId(String transactionId);
    List<Payment> findByUserId(Long userId);
    List<Payment> findByReferenceEntityTypeAndReferenceEntityId(String entityType, Long entityId);
}
