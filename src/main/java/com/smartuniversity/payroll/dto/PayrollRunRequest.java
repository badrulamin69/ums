package com.smartuniversity.payroll.dto;

import lombok.Data;

@Data
public class PayrollRunRequest {
    private String month;
    private int year;
}
