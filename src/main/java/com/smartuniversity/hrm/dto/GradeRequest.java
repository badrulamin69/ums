package com.smartuniversity.hrm.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class GradeRequest {
    @NotBlank
    private String name;
    @NotNull
    private BigDecimal basicSalary;
    @NotNull
    private BigDecimal houseAllowance;
    @NotNull
    private BigDecimal medicalAllowance;
    @NotNull
    private BigDecimal transportAllowance;
}
