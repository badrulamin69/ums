package com.smartuniversity.academic.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CourseRequest {

    @NotBlank(message = "Course code is required")
    private String courseCode;

    @NotBlank(message = "Course name is required")
    private String name;

    @Positive(message = "Credit hours must be positive")
    private double creditHours;

    @NotNull(message = "Year level ID is required")
    private Long yearLevelId;
}
