package com.smartuniversity.hrm.repository;

import com.smartuniversity.hrm.entity.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveTypeRepository extends JpaRepository<LeaveType, Long> {
}
