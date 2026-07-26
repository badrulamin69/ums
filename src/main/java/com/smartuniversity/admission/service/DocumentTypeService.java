package com.smartuniversity.admission.service;

import com.smartuniversity.admission.dto.*;
import com.smartuniversity.admission.entity.DocumentType;
import com.smartuniversity.admission.mapper.DocumentTypeMapper;
import com.smartuniversity.admission.repository.DocumentTypeRepository;
import com.smartuniversity.common.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DocumentTypeService {

    private final DocumentTypeRepository repository;
    private final DocumentTypeMapper mapper;

    public DocumentTypeService(DocumentTypeRepository repository, DocumentTypeMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional
    public DocumentTypeResponse create(DocumentTypeRequest request) {
        DocumentType type = mapper.toEntity(request);
        type = repository.save(type);
        return mapper.toResponse(type);
    }

    public DocumentTypeResponse getById(Long id) {
        DocumentType type = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DocumentType", "id", id));
        return mapper.toResponse(type);
    }

    public Page<DocumentTypeResponse> getAll(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toResponse);
    }

    @Transactional
    public DocumentTypeResponse update(Long id, DocumentTypeRequest request) {
        DocumentType type = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DocumentType", "id", id));
        mapper.updateFromRequest(request, type);
        type = repository.save(type);
        return mapper.toResponse(type);
    }

    @Transactional
    public void deactivate(Long id) {
        DocumentType type = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DocumentType", "id", id));
        type.setActive(false);
        repository.save(type);
    }
}
