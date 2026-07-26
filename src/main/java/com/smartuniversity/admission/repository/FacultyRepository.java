package com.smartuniversity.admission.repository;

import com.smartuniversity.admission.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    List<Faculty> findByActiveTrue();
}
