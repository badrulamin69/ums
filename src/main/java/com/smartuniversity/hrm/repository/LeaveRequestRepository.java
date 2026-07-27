package com.smartuniversity.hrm.repository;

import com.smartuniversity.hrm.entity.LeaveRequest;
import com.smartuniversity.common.enums.LeaveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeId(Long employeeId);
    List<LeaveRequest> findByStatus(LeaveStatus status);
    Page<LeaveRequest> findByStatus(LeaveStatus status, Pageable pageable);
}
