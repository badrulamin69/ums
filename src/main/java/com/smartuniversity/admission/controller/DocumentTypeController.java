package com.smartuniversity.admission.controller;

import com.smartuniversity.admission.dto.*;
import com.smartuniversity.admission.service.DocumentTypeService;
import com.smartuniversity.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/document-types")
public class DocumentTypeController {

    private final DocumentTypeService documentTypeService;

    public DocumentTypeController(DocumentTypeService documentTypeService) {
        this.documentTypeService = documentTypeService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DocumentTypeResponse>> create(@Valid @RequestBody DocumentTypeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Document type created", documentTypeService.create(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DocumentTypeResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(documentTypeService.getById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<DocumentTypeResponse>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(documentTypeService.getAll(pageable)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DocumentTypeResponse>> update(
            @PathVariable Long id, @Valid @RequestBody DocumentTypeRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Document type updated", documentTypeService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deactivate(@PathVariable Long id) {
        documentTypeService.deactivate(id);
        return ResponseEntity.ok(ApiResponse.success("Document type deactivated", null));
    }
}
