package com.smartuniversity.admission.controller;

import com.smartuniversity.admission.dto.*;
import com.smartuniversity.admission.service.FacultyService;
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
@RequestMapping("/api/faculties")
public class FacultyController {

    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FacultyResponse>> create(@Valid @RequestBody FacultyRequest request) {
        FacultyResponse response = facultyService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Faculty created", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FacultyResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(facultyService.getById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<FacultyResponse>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(facultyService.getAll(pageable)));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<FacultyResponse>>> getAllActive() {
        return ResponseEntity.ok(ApiResponse.success(facultyService.getAllActive()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FacultyResponse>> update(@PathVariable Long id,
                                                                @Valid @RequestBody FacultyRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Faculty updated", facultyService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deactivate(@PathVariable Long id) {
        facultyService.deactivate(id);
        return ResponseEntity.ok(ApiResponse.success("Faculty deactivated", null));
    }
}
