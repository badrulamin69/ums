package com.smartuniversity.academic.controller;

import com.smartuniversity.academic.dto.*;
import com.smartuniversity.academic.service.YearLevelService;
import com.smartuniversity.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/year-levels")
public class YearLevelController {

    private final YearLevelService service;

    public YearLevelController(YearLevelService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<ApiResponse<YearLevelResponse>> create(@Valid @RequestBody YearLevelRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Year level created", service.create(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<YearLevelResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id)));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<ApiResponse<List<YearLevelResponse>>> getByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(ApiResponse.success(service.getByDepartment(departmentId)));
    }
}
