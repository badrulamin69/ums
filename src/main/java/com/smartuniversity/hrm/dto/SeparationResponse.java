package com.smartuniversity.hrm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeparationResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String type;
    private LocalDate effectiveDate;
    private String reason;
    private boolean approved;
}
