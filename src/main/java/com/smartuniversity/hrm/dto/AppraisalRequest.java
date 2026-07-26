package com.smartuniversity.hrm.dto;

import com.smartuniversity.common.enums.AppraisalRating;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AppraisalRequest {
    @NotNull
    private Long employeeId;
    @NotNull
    private LocalDate appraisalDate;
    @NotNull
    private int reviewYear;
    @NotNull
    private AppraisalRating rating;
    private String comments;
    private Long reviewerId;
}
