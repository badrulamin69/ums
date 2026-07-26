package com.smartuniversity.admission.repository;

import com.smartuniversity.admission.entity.ApplicantDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicantDocumentRepository extends JpaRepository<ApplicantDocument, Long> {
    List<ApplicantDocument> findByApplicantId(Long applicantId);
}
