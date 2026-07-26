package com.smartuniversity.hrm.controller;

import com.smartuniversity.common.ApiResponse;
import com.smartuniversity.hrm.dto.*;
import com.smartuniversity.hrm.entity.*;
import com.smartuniversity.hrm.service.JobPostingService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-postings")
public class JobPostingController {

    private final JobPostingService jobPostingService;

    public JobPostingController(JobPostingService jobPostingService) {
        this.jobPostingService = jobPostingService;
    }

    @PostMapping
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<JobPosting>> create(@Valid @RequestBody JobPostingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Job posting created", jobPostingService.create(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<JobPosting>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(jobPostingService.getAll(pageable)));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<JobPosting>>> getActive() {
        return ResponseEntity.ok(ApiResponse.success(jobPostingService.getActive()));
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<ApiResponse<JobApplication>> apply(@PathVariable Long id,
                                                              @RequestBody JobApplication application) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Application submitted", jobPostingService.apply(id, application)));
    }

    @GetMapping("/{id}/applications")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<JobApplication>>> getApplications(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(jobPostingService.getApplications(id)));
    }

    @PostMapping("/applications/{applicationId}/interview")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Interview>> scheduleInterview(
            @PathVariable Long applicationId, @RequestBody Interview interview) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Interview scheduled",
                        jobPostingService.scheduleInterview(applicationId, interview)));
    }
}
