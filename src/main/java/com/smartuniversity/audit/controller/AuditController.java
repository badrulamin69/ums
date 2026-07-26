package com.smartuniversity.audit.controller;

import com.smartuniversity.audit.dto.AuditLogResponse;
import com.smartuniversity.audit.service.AuditService;
import com.smartuniversity.common.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/audit-logs")
@PreAuthorize("hasRole('ADMIN')")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AuditLogResponse>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(auditService.getAll(pageable)));
    }
}
