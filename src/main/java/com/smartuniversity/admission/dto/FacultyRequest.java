package com.smartuniversity.admission.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FacultyRequest {

    @NotBlank(message = "Faculty name is required")
    private String name;

    private String code;
    private String description;
}
