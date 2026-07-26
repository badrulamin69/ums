package com.smartuniversity.hrm.controller;

import com.smartuniversity.common.ApiResponse;
import com.smartuniversity.hrm.dto.*;
import com.smartuniversity.hrm.service.DesignationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/designations")
public class DesignationController {

    private final DesignationService service;

    public DesignationController(DesignationService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DesignationResponse>> create(@Valid @RequestBody DesignationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Designation created", service.create(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DesignationResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<DesignationResponse>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(pageable)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DesignationResponse>> update(
            @PathVariable Long id, @Valid @RequestBody DesignationRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Designation updated", service.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deactivate(@PathVariable Long id) {
        service.deactivate(id);
        return ResponseEntity.ok(ApiResponse.success("Designation deactivated", null));
    }
}
