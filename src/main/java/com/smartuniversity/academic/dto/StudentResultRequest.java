package com.smartuniversity.academic.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class StudentResultRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotNull(message = "Academic session ID is required")
    private Long academicSessionId;

    @NotNull(message = "Grade point is required")
    @DecimalMin(value = "0.0") @DecimalMax(value = "4.0")
    private Double gradePoint;

    @Positive(message = "Credit hours must be positive")
    private double creditHours;

    private String letterGrade;
}
