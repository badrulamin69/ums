package com.smartuniversity.payroll.controller;

import com.smartuniversity.common.ApiResponse;
import com.smartuniversity.payroll.dto.*;
import com.smartuniversity.payroll.entity.SalaryStructure;
import com.smartuniversity.payroll.mapper.PayrollMapper;
import com.smartuniversity.payroll.repository.SalaryStructureRepository;
import com.smartuniversity.hrm.entity.Grade;
import com.smartuniversity.hrm.repository.GradeRepository;
import com.smartuniversity.common.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/salary-structures")
public class SalaryStructureController {

    private final SalaryStructureRepository repository;
    private final GradeRepository gradeRepository;

    public SalaryStructureController(SalaryStructureRepository repository, GradeRepository gradeRepository) {
        this.repository = repository;
        this.gradeRepository = gradeRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('PAYROLL') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SalaryStructureResponse>> create(@Valid @RequestBody SalaryStructureRequest request) {
        Grade grade = gradeRepository.findById(request.getGradeId())
                .orElseThrow(() -> new ResourceNotFoundException("Grade", "id", request.getGradeId()));

        SalaryStructure ss = SalaryStructure.builder()
                .grade(grade)
                .basicSalary(request.getBasicSalary())
                .houseAllowance(request.getHouseAllowance())
                .medicalAllowance(request.getMedicalAllowance())
                .transportAllowance(request.getTransportAllowance())
                .taxRate(request.getTaxRate())
                .providentFundRate(request.getProvidentFundRate())
                .build();
        ss = repository.save(ss);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Salary structure created", toResponse(ss)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<SalaryStructureResponse>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                repository.findAll(pageable).map(this::toResponse)));
    }

    private SalaryStructureResponse toResponse(SalaryStructure ss) {
        return SalaryStructureResponse.builder()
                .id(ss.getId())
                .gradeId(ss.getGrade().getId())
                .gradeName(ss.getGrade().getName())
                .basicSalary(ss.getBasicSalary())
                .houseAllowance(ss.getHouseAllowance())
                .medicalAllowance(ss.getMedicalAllowance())
                .transportAllowance(ss.getTransportAllowance())
                .taxRate(ss.getTaxRate())
                .providentFundRate(ss.getProvidentFundRate())
                .build();
    }
}
