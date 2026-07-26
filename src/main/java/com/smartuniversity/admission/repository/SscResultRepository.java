package com.smartuniversity.admission.repository;

import com.smartuniversity.admission.entity.SscResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SscResultRepository extends JpaRepository<SscResult, Long> {
    Optional<SscResult> findByApplicantId(Long applicantId);
}
