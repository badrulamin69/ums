package com.smartuniversity.payroll.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class SalaryStructureRequest {
    @NotNull
    private Long gradeId;
    @NotNull
    private BigDecimal basicSalary;
    @NotNull
    private BigDecimal houseAllowance;
    @NotNull
    private BigDecimal medicalAllowance;
    @NotNull
    private BigDecimal transportAllowance;
    @NotNull
    private BigDecimal taxRate;
    @NotNull
    private BigDecimal providentFundRate;
}
