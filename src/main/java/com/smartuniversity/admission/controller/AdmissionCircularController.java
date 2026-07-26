package com.smartuniversity.admission.controller;

import com.smartuniversity.admission.dto.*;
import com.smartuniversity.admission.service.AdmissionCircularService;
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
@RequestMapping("/api/admission-circulars")
public class AdmissionCircularController {

    private final AdmissionCircularService circularService;

    public AdmissionCircularController(AdmissionCircularService circularService) {
        this.circularService = circularService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMISSION')")
    public ResponseEntity<ApiResponse<AdmissionCircularResponse>> create(@Valid @RequestBody AdmissionCircularRequest request) {
        AdmissionCircularResponse response = circularService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Admission circular created", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdmissionCircularResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(circularService.getById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AdmissionCircularResponse>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(circularService.getAll(pageable)));
    }

    @GetMapping("/faculty/{facultyId}/session/{session}")
    public ResponseEntity<ApiResponse<List<AdmissionCircularResponse>>> getByFacultyAndSession(
            @PathVariable Long facultyId, @PathVariable String session) {
        return ResponseEntity.ok(ApiResponse.success(circularService.getByFacultyAndSession(facultyId, session)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMISSION')")
    public ResponseEntity<ApiResponse<AdmissionCircularResponse>> update(@PathVariable Long id,
                                                                          @Valid @RequestBody AdmissionCircularRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Circular updated", circularService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deactivate(@PathVariable Long id) {
        circularService.deactivate(id);
        return ResponseEntity.ok(ApiResponse.success("Circular deactivated", null));
    }
}
