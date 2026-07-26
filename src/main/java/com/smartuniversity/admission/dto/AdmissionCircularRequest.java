package com.smartuniversity.admission.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class AdmissionCircularRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Session is required")
    private String session;

    @NotNull(message = "Faculty ID is required")
    private Long facultyId;

    @NotNull(message = "Registration start date is required")
    private LocalDate registrationStartDate;

    @NotNull(message = "Registration end date is required")
    private LocalDate registrationEndDate;

    @NotNull(message = "Application fee is required")
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal applicationFee;

    @Positive(message = "Total seats must be positive")
    private int totalSeats;
}
