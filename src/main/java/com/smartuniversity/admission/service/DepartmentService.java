package com.smartuniversity.admission.service;

import com.smartuniversity.admission.dto.*;
import com.smartuniversity.admission.entity.Department;
import com.smartuniversity.admission.entity.Faculty;
import com.smartuniversity.admission.mapper.DepartmentMapper;
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
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final FacultyRepository facultyRepository;
    private final DepartmentMapper departmentMapper;

    public DepartmentService(DepartmentRepository departmentRepository, FacultyRepository facultyRepository,
                             DepartmentMapper departmentMapper) {
        this.departmentRepository = departmentRepository;
        this.facultyRepository = facultyRepository;
        this.departmentMapper = departmentMapper;
    }

    @Transactional
    public DepartmentResponse create(DepartmentRequest request) {
        Faculty faculty = facultyRepository.findById(request.getFacultyId())
                .orElseThrow(() -> new ResourceNotFoundException("Faculty", "id", request.getFacultyId()));
        Department department = departmentMapper.toEntity(request);
        department.setFaculty(faculty);
        department = departmentRepository.save(department);
        return departmentMapper.toResponse(department);
    }

    public DepartmentResponse getById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        return departmentMapper.toResponse(department);
    }

    public Page<DepartmentResponse> getAll(Pageable pageable) {
        return departmentRepository.findAll(pageable).map(departmentMapper::toResponse);
    }

    public List<DepartmentResponse> getByFacultyId(Long facultyId) {
        return departmentRepository.findByFacultyIdAndActiveTrue(facultyId).stream()
                .map(departmentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public DepartmentResponse update(Long id, DepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        if (request.getFacultyId() != null) {
            Faculty faculty = facultyRepository.findById(request.getFacultyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Faculty", "id", request.getFacultyId()));
            department.setFaculty(faculty);
        }
        departmentMapper.updateFromRequest(request, department);
        department = departmentRepository.save(department);
        return departmentMapper.toResponse(department);
    }

    @Transactional
    public void deactivate(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        department.setActive(false);
        departmentRepository.save(department);
    }
}
