package com.smartuniversity.academic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseResponse {

    private Long id;
    private String courseCode;
    private String name;
    private double creditHours;
    private Long yearLevelId;
    private int yearNumber;
    private boolean active;
}
