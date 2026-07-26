package com.smartuniversity.hrm.repository;

import com.smartuniversity.hrm.entity.ApprovalStep;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApprovalStepRepository extends JpaRepository<ApprovalStep, Long> {
    List<ApprovalStep> findByWorkflowIdOrderByStepOrder(Long workflowId);
}
