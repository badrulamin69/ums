package com.smartuniversity.hrm.dto;

import com.smartuniversity.common.enums.ApprovalStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromotionResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String fromDesignation;
    private String toDesignation;
    private String fromGrade;
    private String toGrade;
    private String type;
    private LocalDate effectiveDate;
    private String remarks;
}
