package com.smartuniversity.admission.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicantDocumentResponse {

    private Long id;
    private Long applicantId;
    private String documentType;
    private String fileName;
    private String fileUrl;
    private boolean verified;
}
