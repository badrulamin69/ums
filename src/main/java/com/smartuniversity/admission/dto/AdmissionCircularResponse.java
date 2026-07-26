package com.smartuniversity.admission.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdmissionCircularResponse {

    private Long id;
    private String title;
    private String session;
    private Long facultyId;
    private String facultyName;
    private LocalDate registrationStartDate;
    private LocalDate registrationEndDate;
    private BigDecimal applicationFee;
    private int totalSeats;
    private boolean active;
}
