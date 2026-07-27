package com.smartuniversity.student.repository;

import com.smartuniversity.student.entity.StudentFaceData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentFaceDataRepository extends JpaRepository<StudentFaceData, Long> {
    Optional<StudentFaceData> findByStudentId(Long studentId);
    Optional<StudentFaceData> findByStudentUserId(Long userId);
    boolean existsByStudentId(Long studentId);
}
