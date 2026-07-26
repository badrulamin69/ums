package com.smartuniversity.admission.controller;

import com.smartuniversity.admission.dto.*;
import com.smartuniversity.admission.service.ApplicantDocumentService;
import com.smartuniversity.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applicant-documents")
public class ApplicantDocumentController {

    private final ApplicantDocumentService documentService;

    public ApplicantDocumentController(ApplicantDocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ApplicantDocumentResponse>> upload(
            @Valid @RequestBody ApplicantDocumentRequest request) {
        ApplicantDocumentResponse response = documentService.upload(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Document uploaded", response));
    }

    @GetMapping("/applicant/{applicantId}")
    public ResponseEntity<ApiResponse<List<ApplicantDocumentResponse>>> getByApplicantId(
            @PathVariable Long applicantId) {
        return ResponseEntity.ok(ApiResponse.success(documentService.getByApplicantId(applicantId)));
    }

    @PutMapping("/{id}/verify")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMISSION')")
    public ResponseEntity<ApiResponse<ApplicantDocumentResponse>> verify(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Document verified", documentService.verify(id)));
    }
}
