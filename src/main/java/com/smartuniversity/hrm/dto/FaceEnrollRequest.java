package com.smartuniversity.hrm.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FaceEnrollRequest {
    @NotBlank(message = "Base64 image is required")
    private String base64Image;
}
