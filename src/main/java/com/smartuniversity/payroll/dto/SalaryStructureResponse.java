package com.smartuniversity.payroll.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryStructureResponse {
    private Long id;
    private Long gradeId;
    private String gradeName;
    private BigDecimal basicSalary;
    private BigDecimal houseAllowance;
    private BigDecimal medicalAllowance;
    private BigDecimal transportAllowance;
    private BigDecimal taxRate;
    private BigDecimal providentFundRate;
}
