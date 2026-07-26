package com.smartuniversity.hrm.dto;

import com.smartuniversity.common.enums.PromotionType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PromotionRequest {

    @NotNull
    private Long employeeId;
    private Long fromDesignationId;
    @NotNull
    private Long toDesignationId;
    private Long fromGradeId;
    private Long toGradeId;
    @NotNull
    private PromotionType type;
    @NotNull
    private LocalDate effectiveDate;
    private String remarks;
}
