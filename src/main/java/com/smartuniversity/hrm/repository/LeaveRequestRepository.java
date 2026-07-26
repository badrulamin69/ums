package com.smartuniversity.hrm.repository;

import com.smartuniversity.hrm.entity.LeaveRequest;
import com.smartuniversity.common.enums.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeId(Long employeeId);
    List<LeaveRequest> findByStatus(LeaveStatus status);
}
