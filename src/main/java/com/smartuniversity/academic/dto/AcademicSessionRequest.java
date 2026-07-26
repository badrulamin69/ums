package com.smartuniversity.academic.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AcademicSessionRequest {

    @NotBlank(message = "Session name is required")
    private String name;

    @Min(value = 2020, message = "Start year must be 2020 or later")
    private int startYear;

    @Min(value = 2020, message = "End year must be 2020 or later")
    private int endYear;
}
