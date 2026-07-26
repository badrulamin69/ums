package com.smartuniversity.hrm.service;

import com.smartuniversity.common.exception.ResourceNotFoundException;
import com.smartuniversity.hrm.entity.*;
import com.smartuniversity.hrm.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobPostingService {

    private final JobPostingRepository jobPostingRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final InterviewRepository interviewRepository;

    public JobPostingService(JobPostingRepository jobPostingRepository,
                             JobApplicationRepository jobApplicationRepository,
                             InterviewRepository interviewRepository) {
        this.jobPostingRepository = jobPostingRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.interviewRepository = interviewRepository;
    }

    @Transactional
    public JobPosting create(com.smartuniversity.hrm.dto.JobPostingRequest request) {
        JobPosting posting = JobPosting.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .department(request.getDepartment())
                .vacancies(request.getVacancies())
                .postingDate(request.getPostingDate())
                .closingDate(request.getClosingDate())
                .build();
        return jobPostingRepository.save(posting);
    }

    public Page<JobPosting> getAll(Pageable pageable) {
        return jobPostingRepository.findAll(pageable);
    }

    public List<JobPosting> getActive() {
        return jobPostingRepository.findByActiveTrue();
    }

    @Transactional
    public JobApplication apply(Long jobPostingId, JobApplication application) {
        JobPosting posting = jobPostingRepository.findById(jobPostingId)
                .orElseThrow(() -> new ResourceNotFoundException("JobPosting", "id", jobPostingId));
        application.setJobPosting(posting);
        return jobApplicationRepository.save(application);
    }

    public List<JobApplication> getApplications(Long jobPostingId) {
        return jobApplicationRepository.findByJobPostingId(jobPostingId);
    }

    @Transactional
    public Interview scheduleInterview(Long applicationId, Interview interview) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("JobApplication", "id", applicationId));
        interview.setJobApplication(application);
        return interviewRepository.save(interview);
    }
}
