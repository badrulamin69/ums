package com.smartuniversity.hrm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPostingResponse {
    private Long id;
    private String title;
    private String description;
    private String department;
    private int vacancies;
    private LocalDate postingDate;
    private LocalDate closingDate;
    private boolean active;
}
