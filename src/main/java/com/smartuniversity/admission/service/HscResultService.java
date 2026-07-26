package com.smartuniversity.admission.service;

import com.smartuniversity.admission.dto.*;
import com.smartuniversity.admission.entity.Applicant;
import com.smartuniversity.admission.entity.HscResult;
import com.smartuniversity.admission.mapper.HscResultMapper;
import com.smartuniversity.admission.repository.ApplicantRepository;
import com.smartuniversity.admission.repository.HscResultRepository;
import com.smartuniversity.common.exception.BadRequestException;
import com.smartuniversity.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HscResultService {

    private final HscResultRepository hscResultRepository;
    private final ApplicantRepository applicantRepository;
    private final HscResultMapper mapper;

    public HscResultService(HscResultRepository hscResultRepository, ApplicantRepository applicantRepository,
                            HscResultMapper mapper) {
        this.hscResultRepository = hscResultRepository;
        this.applicantRepository = applicantRepository;
        this.mapper = mapper;
    }

    @Transactional
    public HscResultResponse submit(Long applicantId, HscResultRequest request) {
        Applicant applicant = applicantRepository.findById(applicantId)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant", "id", applicantId));

        if (hscResultRepository.findByApplicantId(applicantId).isPresent()) {
            throw new BadRequestException("HSC result already submitted for this applicant");
        }

        HscResult result = mapper.toEntity(request);
        result.setApplicant(applicant);
        result = hscResultRepository.save(result);
        return mapper.toResponse(result);
    }

    public HscResultResponse getByApplicantId(Long applicantId) {
        HscResult result = hscResultRepository.findByApplicantId(applicantId)
                .orElseThrow(() -> new ResourceNotFoundException("HscResult", "applicantId", applicantId));
        return mapper.toResponse(result);
    }

    @Transactional
    public HscResultResponse verify(Long applicantId) {
        HscResult result = hscResultRepository.findByApplicantId(applicantId)
                .orElseThrow(() -> new ResourceNotFoundException("HscResult", "applicantId", applicantId));
        result.setVerified(true);
        result = hscResultRepository.save(result);
        return mapper.toResponse(result);
    }

    @Transactional
    public HscResultResponse update(Long applicantId, HscResultRequest request) {
        HscResult result = hscResultRepository.findByApplicantId(applicantId)
                .orElseThrow(() -> new ResourceNotFoundException("HscResult", "applicantId", applicantId));
        result.setBoard(request.getBoard());
        result.setExamYear(request.getExamYear());
        result.setRollNumber(request.getRollNumber());
        result.setRegistrationNumber(request.getRegistrationNumber());
        result.setStudentGroup(request.getGroup());
        result.setInstitution(request.getInstitution());
        result.setGpa(request.getGpa());
        result.setScienceGpa(request.getScienceGpa());
        result.setMathGpa(request.getMathGpa());
        result.setVerified(false);
        result = hscResultRepository.save(result);
        return mapper.toResponse(result);
    }
}
