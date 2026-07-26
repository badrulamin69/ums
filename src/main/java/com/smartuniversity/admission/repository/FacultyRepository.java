package com.smartuniversity.admission.repository;

import com.smartuniversity.admission.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    List<Faculty> findByActiveTrue();
    Optional<Faculty> findByCode(String code);
}
