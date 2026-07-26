package com.smartuniversity.hrm.repository;

import com.smartuniversity.hrm.entity.Separation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeparationRepository extends JpaRepository<Separation, Long> {
    List<Separation> findByEmployeeId(Long employeeId);
}
