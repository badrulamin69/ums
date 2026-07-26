package com.smartuniversity.hrm.controller;

import com.smartuniversity.common.ApiResponse;
import com.smartuniversity.hrm.dto.*;
import com.smartuniversity.hrm.service.GradeService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/grades")
public class GradeController {

    private final GradeService service;

    public GradeController(GradeService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<GradeResponse>> create(@Valid @RequestBody GradeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Grade created", service.create(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GradeResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<GradeResponse>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(pageable)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<GradeResponse>> update(
            @PathVariable Long id, @Valid @RequestBody GradeRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Grade updated", service.update(id, request)));
    }
}
