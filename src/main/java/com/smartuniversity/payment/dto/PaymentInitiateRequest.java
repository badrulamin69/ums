package com.smartuniversity.payment.dto;

import com.smartuniversity.common.enums.PaymentType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentInitiateRequest {

    @NotNull
    private PaymentType paymentType;

    @NotBlank
    private String referenceEntityType;

    @NotNull
    private Long referenceEntityId;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal amount;
}
