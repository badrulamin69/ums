package com.smartuniversity.academic.repository;

import com.smartuniversity.academic.entity.YearResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface YearResultRepository extends JpaRepository<YearResult, Long> {
    List<YearResult> findByStudentId(Long studentId);
    Optional<YearResult> findByStudentIdAndYearLevelIdAndAcademicSessionId(
            Long studentId, Long yearLevelId, Long sessionId);
}
