package com.smartuniversity.academic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class YearResultResponse {

    private Long id;
    private Long studentId;
    private Long yearLevelId;
    private int yearNumber;
    private Long academicSessionId;
    private String academicSessionName;
    private Double gpa;
    private double totalCreditHours;
}
