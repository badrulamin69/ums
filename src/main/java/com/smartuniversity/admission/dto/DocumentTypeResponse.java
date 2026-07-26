package com.smartuniversity.admission.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentTypeResponse {
    private Long id;
    private String name;
    private String description;
    private boolean required;
    private String allowedFormats;
    private boolean active;
}
