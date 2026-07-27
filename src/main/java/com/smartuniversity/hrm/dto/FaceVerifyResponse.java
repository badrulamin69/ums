package com.smartuniversity.hrm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FaceVerifyResponse {
    private boolean matched;
    private Long employeeId;
    private String employeeName;
    private double confidence;
    private String message;
}
