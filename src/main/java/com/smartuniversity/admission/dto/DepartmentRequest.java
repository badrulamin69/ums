package com.smartuniversity.admission.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DepartmentRequest {

    @NotNull(message = "Faculty ID is required")
    private Long facultyId;

    private String name;
    private String code;
}
