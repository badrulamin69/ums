package com.smartuniversity.hrm.repository;

import com.smartuniversity.hrm.entity.PromotionHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PromotionHistoryRepository extends JpaRepository<PromotionHistory, Long> {
    List<PromotionHistory> findByEmployeeId(Long employeeId);
}
