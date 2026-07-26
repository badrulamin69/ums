package com.smartuniversity.hrm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprovalWorkflowResponse {
    private Long id;
    private String entityType;
    private Long entityId;
    private String name;
    private String status;
    private List<ApprovalStepResponse> steps;
}
