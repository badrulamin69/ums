package com.smartuniversity.hrm.repository;

import com.smartuniversity.hrm.entity.Appraisal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppraisalRepository extends JpaRepository<Appraisal, Long> {
    List<Appraisal> findByEmployeeId(Long employeeId);
    List<Appraisal> findByReviewYear(int year);
}
