package com.smartuniversity.admission.service;

import com.smartuniversity.admission.dto.*;
import com.smartuniversity.admission.entity.Department;
import com.smartuniversity.admission.entity.Faculty;
import com.smartuniversity.admission.mapper.DepartmentMapper;
import com.smartuniversity.admission.mapper.FacultyMapper;
import com.smartuniversity.admission.repository.DepartmentRepository;
import com.smartuniversity.admission.repository.FacultyRepository;
import com.smartuniversity.common.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacultyService {

    private final FacultyRepository facultyRepository;
    private final FacultyMapper facultyMapper;

    public FacultyService(FacultyRepository facultyRepository, FacultyMapper facultyMapper) {
        this.facultyRepository = facultyRepository;
        this.facultyMapper = facultyMapper;
    }

    @Transactional
    public FacultyResponse create(FacultyRequest request) {
        Faculty faculty = facultyMapper.toEntity(request);
        faculty = facultyRepository.save(faculty);
        return facultyMapper.toResponse(faculty);
    }

    public FacultyResponse getById(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty", "id", id));
        return facultyMapper.toResponse(faculty);
    }

    public Page<FacultyResponse> getAll(Pageable pageable) {
        return facultyRepository.findAll(pageable).map(facultyMapper::toResponse);
    }

    public List<FacultyResponse> getAllActive() {
        return facultyRepository.findByActiveTrue().stream()
                .map(facultyMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public FacultyResponse update(Long id, FacultyRequest request) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty", "id", id));
        facultyMapper.updateFromRequest(request, faculty);
        faculty = facultyRepository.save(faculty);
        return facultyMapper.toResponse(faculty);
    }

    @Transactional
    public void deactivate(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty", "id", id));
        faculty.setActive(false);
        facultyRepository.save(faculty);
    }
}
