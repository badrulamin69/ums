package com.smartuniversity.academic.controller;

import com.smartuniversity.academic.dto.*;
import com.smartuniversity.academic.service.CourseTeacherService;
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
@RequestMapping("/api/course-teachers")
public class CourseTeacherController {

    private final CourseTeacherService courseTeacherService;

    public CourseTeacherController(CourseTeacherService courseTeacherService) {
        this.courseTeacherService = courseTeacherService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<ApiResponse<CourseTeacherResponse>> assign(@Valid @RequestBody CourseTeacherRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Teacher assigned", courseTeacherService.assign(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CourseTeacherResponse>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(courseTeacherService.getAll(pageable)));
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<ApiResponse<List<CourseTeacherResponse>>> getBySession(@PathVariable Long sessionId) {
        return ResponseEntity.ok(ApiResponse.success(courseTeacherService.getBySession(sessionId)));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<CourseTeacherResponse>>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success(courseTeacherService.getByEmployee(employeeId)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> remove(@PathVariable Long id) {
        courseTeacherService.remove(id);
        return ResponseEntity.ok(ApiResponse.success("Assignment removed", null));
    }
}
