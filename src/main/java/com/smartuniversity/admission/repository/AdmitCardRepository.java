package com.smartuniversity.admission.repository;

import com.smartuniversity.admission.entity.AdmitCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdmitCardRepository extends JpaRepository<AdmitCard, Long> {
    Optional<AdmitCard> findByApplicantId(Long applicantId);
}
