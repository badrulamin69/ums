package com.smartuniversity.student.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResponse {
    private Long id;
    private Long userId;
    private Long applicantId;
    private String registrationNumber;
    private String firstName;
    private String middleName;
    private String lastName;
    private Double cgpa;
    private boolean active;
}
