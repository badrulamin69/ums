package com.smartuniversity.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {

    private Long id;
    private String transactionId;
    private String paymentType;
    private BigDecimal amount;
    private String currency;
    private String status;
    private String sslCommerzGatewayUrl;
    private LocalDateTime paidAt;
}
