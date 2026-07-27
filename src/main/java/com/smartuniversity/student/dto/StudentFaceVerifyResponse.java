package com.smartuniversity.student.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentFaceVerifyResponse {
    private boolean matched;
    private Long studentId;
    private String studentName;
    private double confidence;
    private String message;
}
