package com.smartuniversity.hrm.repository;

import com.smartuniversity.hrm.entity.ApprovalWorkflow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApprovalWorkflowRepository extends JpaRepository<ApprovalWorkflow, Long> {
    List<ApprovalWorkflow> findByEntityTypeAndEntityId(String entityType, Long entityId);
}
