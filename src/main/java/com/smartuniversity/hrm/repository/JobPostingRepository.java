package com.smartuniversity.hrm.repository;

import com.smartuniversity.hrm.entity.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
    List<JobPosting> findByActiveTrue();
}
