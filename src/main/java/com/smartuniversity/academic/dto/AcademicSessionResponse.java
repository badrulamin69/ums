package com.smartuniversity.academic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademicSessionResponse {

    private Long id;
    private String name;
    private int startYear;
    private int endYear;
    private boolean active;
}
