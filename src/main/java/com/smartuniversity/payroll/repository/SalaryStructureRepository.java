package com.smartuniversity.payroll.repository;

import com.smartuniversity.payroll.entity.SalaryStructure;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalaryStructureRepository extends JpaRepository<SalaryStructure, Long> {
}
