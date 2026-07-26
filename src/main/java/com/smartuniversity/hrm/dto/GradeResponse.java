package com.smartuniversity.hrm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GradeResponse {
    private Long id;
    private String name;
    private BigDecimal basicSalary;
    private BigDecimal houseAllowance;
    private BigDecimal medicalAllowance;
    private BigDecimal transportAllowance;
    private boolean active;
}
