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
public class PayslipResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private BigDecimal basicSalary;
    private BigDecimal grossSalary;
    private BigDecimal taxDeduction;
    private BigDecimal providentFundDeduction;
    private BigDecimal netSalary;
}
