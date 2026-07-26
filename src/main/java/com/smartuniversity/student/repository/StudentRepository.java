package com.smartuniversity.student.repository;

import com.smartuniversity.student.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    Optional<Student> findByRegistrationNumber(String registrationNumber);
    Optional<Student> findByApplicantId(Long applicantId);
}
