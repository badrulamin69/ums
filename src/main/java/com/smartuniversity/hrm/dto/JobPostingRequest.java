package com.smartuniversity.hrm.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class JobPostingRequest {
    @NotNull
    private String title;
    private String description;
    @NotNull
    private String department;
    @NotNull
    private int vacancies;
    @NotNull
    private LocalDate postingDate;
    @NotNull
    private LocalDate closingDate;
}
