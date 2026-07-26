package com.smartuniversity.academic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResultResponse {

    private Long id;
    private Long studentId;
    private String studentName;
    private Long courseId;
    private String courseName;
    private String courseCode;
    private Long academicSessionId;
    private String academicSessionName;
    private Double gradePoint;
    private double creditHours;
    private String letterGrade;
    private boolean published;
}
