package com.smartuniversity.academic.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class YearLevelRequest {

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @Min(value = 1) @Max(value = 4)
    private int yearNumber;

    @NotBlank(message = "Name is required")
    private String name;
}
