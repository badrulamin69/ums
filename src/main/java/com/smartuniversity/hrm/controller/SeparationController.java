package com.smartuniversity.hrm.controller;

import com.smartuniversity.common.ApiResponse;
import com.smartuniversity.hrm.dto.*;
import com.smartuniversity.hrm.service.SeparationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/separations")
public class SeparationController {

    private final SeparationService service;

    public SeparationController(SeparationService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SeparationResponse>> initiate(@Valid @RequestBody SeparationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Separation initiated", service.initiate(request)));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<SeparationResponse>>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success(service.getByEmployee(employeeId)));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> approve(@PathVariable Long id) {
        service.approve(id);
        return ResponseEntity.ok(ApiResponse.success("Separation approved", null));
    }
}
