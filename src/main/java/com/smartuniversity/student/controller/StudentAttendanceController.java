package com.smartuniversity.student.controller;

import com.smartuniversity.common.ApiResponse;
import com.smartuniversity.common.exception.ResourceNotFoundException;
import com.smartuniversity.security.entity.User;
import com.smartuniversity.security.repository.UserRepository;
import com.smartuniversity.student.dto.StudentAttendanceRequest;
import com.smartuniversity.student.dto.StudentAttendanceResponse;
import com.smartuniversity.student.service.StudentAttendanceService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/student/attendance")
public class StudentAttendanceController {

    private final StudentAttendanceService studentAttendanceService;
    private final UserRepository userRepository;

    public StudentAttendanceController(StudentAttendanceService studentAttendanceService, UserRepository userRepository) {
        this.studentAttendanceService = studentAttendanceService;
        this.userRepository = userRepository;
    }

    @PostMapping("/check-in")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<StudentAttendanceResponse>> checkIn(
            @Valid @RequestBody StudentAttendanceRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Checked in",
                studentAttendanceService.checkIn(request.getStudentId())));
    }

    @PostMapping("/check-out")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<StudentAttendanceResponse>> checkOut(
            @Valid @RequestBody StudentAttendanceRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Checked out",
                studentAttendanceService.checkOut(request.getStudentId())));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<StudentAttendanceResponse>>> getAttendance(
            @RequestParam Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(ApiResponse.success(
                studentAttendanceService.getByStudentAndDateRange(studentId, start, end)));
    }
}
