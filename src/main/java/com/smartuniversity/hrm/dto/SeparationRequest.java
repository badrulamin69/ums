package com.smartuniversity.hrm.dto;

import com.smartuniversity.common.enums.SeparationType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SeparationRequest {
    @NotNull
    private Long employeeId;
    @NotNull
    private SeparationType type;
    @NotNull
    private LocalDate effectiveDate;
    private String reason;
}
