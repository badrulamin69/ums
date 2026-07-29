package com.smartuniversity.admission.controller;

import com.smartuniversity.admission.dto.*;
import com.smartuniversity.admission.service.ApplicantService;
import com.smartuniversity.admission.service.ApplicantDocumentService;
import com.smartuniversity.common.ApiResponse;
import com.smartuniversity.common.FileStorageService;
import com.smartuniversity.common.exception.ResourceNotFoundException;
import com.smartuniversity.security.entity.Role;
import com.smartuniversity.security.entity.User;
import com.smartuniversity.security.repository.RoleRepository;
import com.smartuniversity.security.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/applicants")
public class ApplicantController {

    private final ApplicantService applicantService;
    private final ApplicantDocumentService documentService;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public ApplicantController(ApplicantService applicantService,
                                 ApplicantDocumentService documentService,
                                 FileStorageService fileStorageService,
                                 UserRepository userRepository,
                                 RoleRepository roleRepository,
                                 PasswordEncoder passwordEncoder) {
        this.applicantService = applicantService;
        this.documentService = documentService;
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ApplicantResponse>> register(
            @Valid @RequestBody ApplicantRequest request) {

        Long userId;
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof UserDetails userDetails) {
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getUsername()));
            userId = user.getId();
        } else {
            userId = applicantService.registerGuest(request);
        }

        ApplicantResponse response = applicantService.register(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Application registered", response));
    }

    @PostMapping(value = "/{id}/photo", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ApplicantDocumentResponse>> uploadPhoto(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        FileStorageService.StoredFile storedFile =
                fileStorageService.store(file, "applicant-documents");

        ApplicantDocumentRequest docRequest = new ApplicantDocumentRequest();
        docRequest.setApplicantId(id);
        docRequest.setDocumentType("Photo");
        docRequest.setFileName(storedFile.fileName());
        docRequest.setFileUrl(storedFile.fileUrl());

        ApplicantDocumentResponse response = documentService.upload(docRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Photo uploaded", response));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMISSION')")
    public ResponseEntity<ApiResponse<Page<ApplicantResponse>>> list(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(applicantService.list(pageable)));
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

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<ApplicantResponse>> updateMyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ApplicantProfileUpdateRequest request) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getUsername()));
        return ResponseEntity.ok(ApiResponse.success("Profile updated",
                applicantService.updateProfile(user.getId(), request)));
    }

    @PutMapping("/{id}/department/{departmentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMISSION') or @resourceSecurity.isApplicantOwner(#id)")
    public ResponseEntity<ApiResponse<ApplicantResponse>> updatePreferredDepartment(
            @PathVariable Long id, @PathVariable Long departmentId) {
        return ResponseEntity.ok(ApiResponse.success(
                "Department updated", applicantService.updatePreferredDepartment(id, departmentId)));
    }
}
