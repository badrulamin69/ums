package com.smartuniversity.payroll.repository;

import com.smartuniversity.payroll.entity.PayrollRun;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PayrollRunRepository extends JpaRepository<PayrollRun, Long> {
    Optional<PayrollRun> findByMonthAndYear(String month, int year);
}
