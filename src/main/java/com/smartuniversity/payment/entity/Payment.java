package com.smartuniversity.payment.entity;

import com.smartuniversity.common.BaseEntity;
import com.smartuniversity.common.enums.PaymentType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String transactionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentType paymentType;

    @Column(nullable = false, length = 50)
    private String referenceEntityType;

    @Column(nullable = false)
    private Long referenceEntityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private com.smartuniversity.security.entity.User user;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 3)
    private String currency = "BDT";

    @Column(nullable = false, length = 30)
    private String status = "PENDING";

    @Column(length = 100)
    private String sslCommerzOrderId;

    @Column(length = 100)
    private String sslCommerzSessionKey;

    private LocalDateTime paidAt;
}
