package com.smartuniversity.hrm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprovalStepResponse {
    private Long id;
    private Long workflowId;
    private int stepOrder;
    private String approverRole;
    private Long approverId;
    private String status;
    private String comments;
    private LocalDateTime decidedAt;
}
