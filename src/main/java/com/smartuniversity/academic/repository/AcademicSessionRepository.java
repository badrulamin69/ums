package com.smartuniversity.academic.repository;

import com.smartuniversity.academic.entity.AcademicSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AcademicSessionRepository extends JpaRepository<AcademicSession, Long> {
    Optional<AcademicSession> findByActiveTrue();
    Optional<AcademicSession> findByName(String name);
}
