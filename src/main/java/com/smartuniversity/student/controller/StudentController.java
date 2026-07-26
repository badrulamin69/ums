package com.smartuniversity.student.controller;

import com.smartuniversity.common.ApiResponse;
import com.smartuniversity.student.dto.StudentRequest;
import com.smartuniversity.student.dto.StudentResponse;
import com.smartuniversity.student.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/enroll/{applicantId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMISSION')")
    public ResponseEntity<ApiResponse<StudentResponse>> enroll(@PathVariable Long applicantId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student enrolled", studentService.enroll(applicantId)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('REGISTRAR') or @resourceSecurity.isStudentOwner(#id)")
    public ResponseEntity<ApiResponse<StudentResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(studentService.getById(id)));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('REGISTRAR') or @resourceSecurity.isOwner(#userId)")
    public ResponseEntity<ApiResponse<StudentResponse>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(studentService.getByUserId(userId)));
    }

    @GetMapping("/registration/{regNo}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('REGISTRAR') or @resourceSecurity.isStudentOwnerByRegNo(#regNo)")
    public ResponseEntity<ApiResponse<StudentResponse>> getByRegistrationNumber(@PathVariable String regNo) {
        return ResponseEntity.ok(ApiResponse.success(studentService.getByRegistrationNumber(regNo)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('REGISTRAR')")
    public ResponseEntity<ApiResponse<Page<StudentResponse>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(studentService.getAll(pageable)));
    }

    @PutMapping("/{id}/profile")
    @PreAuthorize("hasRole('ADMIN') or hasRole('REGISTRAR') or @resourceSecurity.isStudentOwner(#id)")
    public ResponseEntity<ApiResponse<StudentResponse>> updateProfile(
            @PathVariable Long id, @Valid @RequestBody StudentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated", studentService.updateProfile(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deactivate(@PathVariable Long id) {
        studentService.deactivate(id);
        return ResponseEntity.ok(ApiResponse.success("Student deactivated", null));
    }
}
