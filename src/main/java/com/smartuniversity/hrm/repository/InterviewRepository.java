package com.smartuniversity.hrm.repository;

import com.smartuniversity.hrm.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByJobApplicationId(Long jobApplicationId);
}
