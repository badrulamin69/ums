package com.smartuniversity.academic.controller;

import com.smartuniversity.academic.dto.*;
import com.smartuniversity.academic.service.AcademicSessionService;
import com.smartuniversity.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/academic-sessions")
public class AcademicSessionController {

    private final AcademicSessionService sessionService;

    public AcademicSessionController(AcademicSessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AcademicSessionResponse>> create(@Valid @RequestBody AcademicSessionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Session created", sessionService.create(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AcademicSessionResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(sessionService.getById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AcademicSessionResponse>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(sessionService.getAll(pageable)));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<AcademicSessionResponse>> getActive() {
        return ResponseEntity.ok(ApiResponse.success(sessionService.getActive()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AcademicSessionResponse>> update(@PathVariable Long id,
                                                                        @Valid @RequestBody AcademicSessionRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Session updated", sessionService.update(id, request)));
    }
}
