package com.smartuniversity.admission.repository;

import com.smartuniversity.admission.entity.HscResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HscResultRepository extends JpaRepository<HscResult, Long> {
    Optional<HscResult> findByApplicantId(Long applicantId);
}
