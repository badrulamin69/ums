package com.smartuniversity.admission.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class HscResultRequest {

    @NotBlank(message = "Board is required")
    private String board;

    @Min(value = 2000)
    private int examYear;

    @NotBlank(message = "Roll number is required")
    private String rollNumber;

    private String registrationNumber;

    @NotBlank(message = "Group is required")
    private String group;

    private String institution;

    @NotNull
    @DecimalMin(value = "0.0") @DecimalMax(value = "5.0")
    private Double gpa;

    private Double scienceGpa;
    private Double mathGpa;
}
