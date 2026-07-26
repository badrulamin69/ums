package com.smartuniversity.hrm.dto;

import com.smartuniversity.common.enums.ApprovalStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApprovalStepActionRequest {
    @NotNull
    private Long stepId;
    @NotNull
    private ApprovalStatus action;
    private String comments;
}
