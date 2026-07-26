package com.smartuniversity.academic.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CourseTeacherRequest {

    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Academic session ID is required")
    private Long academicSessionId;
}
