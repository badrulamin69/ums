package com.smartuniversity.student.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StudentFaceVerifyRequest {
    @NotBlank(message = "Base64 image is required")
    private String base64Image;
}
