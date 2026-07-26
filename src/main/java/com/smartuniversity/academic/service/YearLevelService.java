package com.smartuniversity.academic.service;

import com.smartuniversity.academic.dto.*;
import com.smartuniversity.academic.entity.YearLevel;
import com.smartuniversity.academic.mapper.YearLevelMapper;
import com.smartuniversity.academic.repository.YearLevelRepository;
import com.smartuniversity.admission.entity.Department;
import com.smartuniversity.admission.repository.DepartmentRepository;
import com.smartuniversity.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class YearLevelService {

    private final YearLevelRepository repository;
    private final DepartmentRepository departmentRepository;
    private final YearLevelMapper mapper;

    public YearLevelService(YearLevelRepository repository, DepartmentRepository departmentRepository,
                            YearLevelMapper mapper) {
        this.repository = repository;
        this.departmentRepository = departmentRepository;
        this.mapper = mapper;
    }

    @Transactional
    public YearLevelResponse create(YearLevelRequest request) {
        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));
        YearLevel yl = YearLevel.builder()
                .yearNumber(request.getYearNumber())
                .name(request.getName())
                .department(dept)
                .build();
        yl = repository.save(yl);
        return mapper.toResponse(yl);
    }

    public YearLevelResponse getById(Long id) {
        YearLevel yl = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("YearLevel", "id", id));
        return mapper.toResponse(yl);
    }

    public List<YearLevelResponse> getByDepartment(Long departmentId) {
        return repository.findByDepartmentIdOrderByYearNumber(departmentId).stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }
}
