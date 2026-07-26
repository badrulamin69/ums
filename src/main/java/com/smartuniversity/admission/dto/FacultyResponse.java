package com.smartuniversity.admission.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacultyResponse {

    private Long id;
    private String name;
    private String code;
    private String description;
    private boolean active;
}
