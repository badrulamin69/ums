package com.smartuniversity.academic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseTeacherResponse {

    private Long id;
    private Long courseId;
    private String courseName;
    private String courseCode;
    private Long employeeId;
    private String employeeName;
    private Long academicSessionId;
    private String academicSessionName;
}
