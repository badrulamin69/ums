package com.smartuniversity.academic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class YearLevelResponse {

    private Long id;
    private int yearNumber;
    private String name;
    private Long departmentId;
    private String departmentName;
}
