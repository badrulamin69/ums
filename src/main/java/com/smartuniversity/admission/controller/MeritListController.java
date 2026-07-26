package com.smartuniversity.admission.controller;

import com.smartuniversity.admission.dto.MeritListResponse;
import com.smartuniversity.admission.service.MeritListService;
import com.smartuniversity.common.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/merit-lists")
public class MeritListController {

    private final MeritListService meritListService;

    public MeritListController(MeritListService meritListService) {
        this.meritListService = meritListService;
    }

    @PostMapping("/generate/{circularId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMISSION')")
    public ResponseEntity<ApiResponse<List<MeritListResponse>>> generate(@PathVariable Long circularId) {
        List<MeritListResponse> response = meritListService.generateForCircular(circularId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Merit list generated", response));
    }

    @PostMapping("/publish/{circularId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMISSION')")
    public ResponseEntity<ApiResponse<Void>> publish(@PathVariable Long circularId) {
        meritListService.publish(circularId);
        return ResponseEntity.ok(ApiResponse.success("Merit list published", null));
    }

    @GetMapping("/circular/{circularId}")
    public ResponseEntity<ApiResponse<List<MeritListResponse>>> getByCircular(@PathVariable Long circularId) {
        return ResponseEntity.ok(ApiResponse.success(meritListService.getPublishedByCircular(circularId)));
    }

    @GetMapping("/circular/{circularId}/department/{departmentId}")
    public ResponseEntity<ApiResponse<List<MeritListResponse>>> getByCircularAndDepartment(
            @PathVariable Long circularId, @PathVariable Long departmentId) {
        return ResponseEntity.ok(ApiResponse.success(
                meritListService.getPublishedByCircularAndDepartment(circularId, departmentId)));
    }

    @GetMapping("/applicant/{applicantId}")
    public ResponseEntity<ApiResponse<MeritListResponse>> getByApplicant(@PathVariable Long applicantId) {
        return ResponseEntity.ok(ApiResponse.success(meritListService.getByApplicantId(applicantId)));
    }
}
