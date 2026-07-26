package com.smartuniversity.admission.service;

import com.smartuniversity.admission.dto.*;
import com.smartuniversity.admission.entity.Applicant;
import com.smartuniversity.admission.entity.SscResult;
import com.smartuniversity.admission.mapper.SscResultMapper;
import com.smartuniversity.admission.repository.ApplicantRepository;
import com.smartuniversity.admission.repository.SscResultRepository;
import com.smartuniversity.common.exception.BadRequestException;
import com.smartuniversity.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SscResultService {

    private final SscResultRepository sscResultRepository;
    private final ApplicantRepository applicantRepository;
    private final SscResultMapper mapper;

    public SscResultService(SscResultRepository sscResultRepository, ApplicantRepository applicantRepository,
                            SscResultMapper mapper) {
        this.sscResultRepository = sscResultRepository;
        this.applicantRepository = applicantRepository;
        this.mapper = mapper;
    }

    @Transactional
    public SscResultResponse submit(Long applicantId, SscResultRequest request) {
        Applicant applicant = applicantRepository.findById(applicantId)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant", "id", applicantId));

        if (sscResultRepository.findByApplicantId(applicantId).isPresent()) {
            throw new BadRequestException("SSC result already submitted for this applicant");
        }

        SscResult result = mapper.toEntity(request);
        result.setApplicant(applicant);
        result = sscResultRepository.save(result);
        return mapper.toResponse(result);
    }

    public SscResultResponse getByApplicantId(Long applicantId) {
        SscResult result = sscResultRepository.findByApplicantId(applicantId)
                .orElseThrow(() -> new ResourceNotFoundException("SscResult", "applicantId", applicantId));
        return mapper.toResponse(result);
    }

    @Transactional
    public SscResultResponse verify(Long applicantId) {
        SscResult result = sscResultRepository.findByApplicantId(applicantId)
                .orElseThrow(() -> new ResourceNotFoundException("SscResult", "applicantId", applicantId));
        result.setVerified(true);
        result = sscResultRepository.save(result);
        return mapper.toResponse(result);
    }

    @Transactional
    public SscResultResponse update(Long applicantId, SscResultRequest request) {
        SscResult result = sscResultRepository.findByApplicantId(applicantId)
                .orElseThrow(() -> new ResourceNotFoundException("SscResult", "applicantId", applicantId));
        result.setBoard(request.getBoard());
        result.setExamYear(request.getExamYear());
        result.setRollNumber(request.getRollNumber());
        result.setRegistrationNumber(request.getRegistrationNumber());
        result.setGroup(request.getGroup());
        result.setInstitution(request.getInstitution());
        result.setGpa(request.getGpa());
        result.setScienceGpa(request.getScienceGpa());
        result.setMathGpa(request.getMathGpa());
        result.setVerified(false);
        result = sscResultRepository.save(result);
        return mapper.toResponse(result);
    }
}
