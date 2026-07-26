package com.smartuniversity.academic.service;

import com.smartuniversity.academic.dto.*;
import com.smartuniversity.academic.entity.AcademicSession;
import com.smartuniversity.academic.mapper.AcademicSessionMapper;
import com.smartuniversity.academic.repository.AcademicSessionRepository;
import com.smartuniversity.common.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AcademicSessionService {

    private final AcademicSessionRepository sessionRepository;
    private final AcademicSessionMapper sessionMapper;

    public AcademicSessionService(AcademicSessionRepository sessionRepository, AcademicSessionMapper sessionMapper) {
        this.sessionRepository = sessionRepository;
        this.sessionMapper = sessionMapper;
    }

    @Transactional
    public AcademicSessionResponse create(AcademicSessionRequest request) {
        AcademicSession session = sessionMapper.toEntity(request);
        session = sessionRepository.save(session);
        return sessionMapper.toResponse(session);
    }

    public AcademicSessionResponse getById(Long id) {
        AcademicSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AcademicSession", "id", id));
        return sessionMapper.toResponse(session);
    }

    public Page<AcademicSessionResponse> getAll(Pageable pageable) {
        return sessionRepository.findAll(pageable).map(sessionMapper::toResponse);
    }

    public AcademicSessionResponse getActive() {
        AcademicSession session = sessionRepository.findByActiveTrue()
                .orElseThrow(() -> new ResourceNotFoundException("AcademicSession", "active", true));
        return sessionMapper.toResponse(session);
    }

    @Transactional
    public AcademicSessionResponse update(Long id, AcademicSessionRequest request) {
        AcademicSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AcademicSession", "id", id));
        session.setName(request.getName());
        session.setStartYear(request.getStartYear());
        session.setEndYear(request.getEndYear());
        session = sessionRepository.save(session);
        return sessionMapper.toResponse(session);
    }

    @Transactional
    public void deactivate(Long id) {
        AcademicSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AcademicSession", "id", id));
        session.setActive(false);
        sessionRepository.save(session);
    }
}
