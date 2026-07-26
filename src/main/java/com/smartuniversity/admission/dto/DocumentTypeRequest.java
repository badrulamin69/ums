package com.smartuniversity.admission.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DocumentTypeRequest {
    @NotBlank
    private String name;
    private String description;
    private boolean required;
    private String allowedFormats;
}
