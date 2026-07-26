package com.smartuniversity.admission.repository;

import com.smartuniversity.admission.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findByFacultyId(Long facultyId);
    List<Department> findByFacultyIdAndActiveTrue(Long facultyId);
}
