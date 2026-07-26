package com.smartuniversity.hrm.controller;

import com.smartuniversity.common.ApiResponse;
import com.smartuniversity.hrm.dto.*;
import com.smartuniversity.hrm.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> request(@Valid @RequestBody LeaveRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Leave requested", leaveService.request(dto)));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<LeaveRequestResponse>>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success(leaveService.getByEmployee(employeeId)));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> approve(@PathVariable Long id) {
        leaveService.approve(id);
        return ResponseEntity.ok(ApiResponse.success("Leave approved", null));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> reject(@PathVariable Long id) {
        leaveService.reject(id);
        return ResponseEntity.ok(ApiResponse.success("Leave rejected", null));
    }
}
