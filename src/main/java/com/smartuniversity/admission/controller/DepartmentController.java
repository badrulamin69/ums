package com.smartuniversity.admission.controller;

import com.smartuniversity.admission.dto.*;
import com.smartuniversity.admission.service.DepartmentService;
import com.smartuniversity.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentResponse>> create(@Valid @RequestBody DepartmentRequest request) {
        DepartmentResponse response = departmentService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Department created", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(departmentService.getById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<DepartmentResponse>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(departmentService.getAll(pageable)));
    }

    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getByFacultyId(@PathVariable Long facultyId) {
        return ResponseEntity.ok(ApiResponse.success(departmentService.getByFacultyId(facultyId)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentResponse>> update(@PathVariable Long id,
                                                                   @Valid @RequestBody DepartmentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Department updated", departmentService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deactivate(@PathVariable Long id) {
        departmentService.deactivate(id);
        return ResponseEntity.ok(ApiResponse.success("Department deactivated", null));
    }
}
