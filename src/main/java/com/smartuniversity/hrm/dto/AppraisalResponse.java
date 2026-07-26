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
public class AppraisalResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private LocalDate appraisalDate;
    private int reviewYear;
    private String rating;
    private String comments;
    private Long reviewerId;
    private String reviewerName;
}
