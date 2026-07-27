package com.smartuniversity.student.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StudentFaceEnrollRequest {
    @NotBlank(message = "Base64 image is required")
    private String base64Image;
}
