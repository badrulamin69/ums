package com.smartuniversity.payroll.repository;

import com.smartuniversity.payroll.entity.Payslip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PayslipRepository extends JpaRepository<Payslip, Long> {
    List<Payslip> findByPayrollRunId(Long payrollRunId);
    List<Payslip> findByEmployeeId(Long employeeId);
}
