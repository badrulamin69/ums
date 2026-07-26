package com.smartuniversity.admission.controller;

import com.smartuniversity.admission.dto.*;
import com.smartuniversity.admission.service.ApplicantService;
import com.smartuniversity.common.ApiResponse;
import com.smartuniversity.security.entity.User;
import com.smartuniversity.security.repository.UserRepository;
import com.smartuniversity.common.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applicants")
public class ApplicantController {

    private final ApplicantService applicantService;
    private final UserRepository userRepository;

    public ApplicantController(ApplicantService applicantService, UserRepository userRepository) {
        this.applicantService = applicantService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ApplicantResponse>> register(
            @Valid @RequestBody ApplicantRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getUsername()));
        ApplicantResponse response = applicantService.register(request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Application registered", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMISSION') or @resourceSecurity.isApplicantOwner(#id)")
    public ResponseEntity<ApiResponse<ApplicantResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(applicantService.getById(id)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ApplicantResponse>> getMyProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getUsername()));
        return ResponseEntity.ok(ApiResponse.success(applicantService.getByUserId(user.getId())));
    }

    @GetMapping("/application/{applicationNumber}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMISSION')")
    public ResponseEntity<ApiResponse<ApplicantResponse>> getByApplicationNumber(
            @PathVariable String applicationNumber) {
        return ResponseEntity.ok(ApiResponse.success(applicantService.getByApplicationNumber(applicationNumber)));
    }

    @GetMapping("/circular/{circularId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMISSION')")
    public ResponseEntity<ApiResponse<Page<ApplicantResponse>>> getByCircularId(
            @PathVariable Long circularId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(applicantService.getByCircularId(circularId, pageable)));
    }

    @PutMapping("/{id}/department/{departmentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMISSION') or @resourceSecurity.isApplicantOwner(#id)")
    public ResponseEntity<ApiResponse<ApplicantResponse>> updatePreferredDepartment(
            @PathVariable Long id, @PathVariable Long departmentId) {
        return ResponseEntity.ok(ApiResponse.success(
                "Department updated", applicantService.updatePreferredDepartment(id, departmentId)));
    }
}
