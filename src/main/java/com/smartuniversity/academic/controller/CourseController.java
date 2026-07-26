package com.smartuniversity.academic.controller;

import com.smartuniversity.academic.dto.*;
import com.smartuniversity.academic.service.CourseService;
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
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<ApiResponse<CourseResponse>> create(@Valid @RequestBody CourseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Course created", courseService.create(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(courseService.getById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CourseResponse>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(courseService.getAll(pageable)));
    }

    @GetMapping("/year-level/{yearLevelId}")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getByYearLevel(@PathVariable Long yearLevelId) {
        return ResponseEntity.ok(ApiResponse.success(courseService.getByYearLevelId(yearLevelId)));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(ApiResponse.success(courseService.getByDepartmentId(departmentId)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<ApiResponse<CourseResponse>> update(@PathVariable Long id,
                                                               @Valid @RequestBody CourseRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Course updated", courseService.update(id, request)));
    }
}
