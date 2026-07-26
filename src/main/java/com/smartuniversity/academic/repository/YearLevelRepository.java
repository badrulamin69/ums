package com.smartuniversity.academic.repository;

import com.smartuniversity.academic.entity.YearLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface YearLevelRepository extends JpaRepository<YearLevel, Long> {
    List<YearLevel> findByDepartmentIdOrderByYearNumber(Long departmentId);
}
