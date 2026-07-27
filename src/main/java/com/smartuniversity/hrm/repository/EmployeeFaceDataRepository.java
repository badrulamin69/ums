package com.smartuniversity.hrm.repository;

import com.smartuniversity.hrm.entity.EmployeeFaceData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeFaceDataRepository extends JpaRepository<EmployeeFaceData, Long> {
    Optional<EmployeeFaceData> findByEmployeeId(Long employeeId);
    Optional<EmployeeFaceData> findByEmployeeUserId(Long userId);
    boolean existsByEmployeeId(Long employeeId);
}
