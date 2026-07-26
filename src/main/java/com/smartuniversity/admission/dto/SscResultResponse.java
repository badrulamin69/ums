package com.smartuniversity.admission.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SscResultResponse {
    private Long id;
    private Long applicantId;
    private String board;
    private int examYear;
    private String rollNumber;
    private String registrationNumber;
    private String group;
    private String institution;
    private Double gpa;
    private Double scienceGpa;
    private Double mathGpa;
    private boolean verified;
}
