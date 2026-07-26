package com.smartuniversity.admission.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplicantDocumentRequest {

    @NotNull(message = "Applicant ID is required")
    private Long applicantId;

    @NotBlank(message = "Document type is required")
    private String documentType;

    @NotBlank(message = "File name is required")
    private String fileName;

    @NotBlank(message = "File URL is required")
    private String fileUrl;
}
