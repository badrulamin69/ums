package com.smartuniversity.hrm.repository;

import com.smartuniversity.hrm.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GradeRepository extends JpaRepository<Grade, Long> {
}
