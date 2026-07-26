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
public class PayrollRunResponse {
    private Long id;
    private String month;
    private int year;
    private boolean completed;
    private int totalEmployees;
}
