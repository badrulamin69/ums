package com.smartuniversity.student.repository;

import com.smartuniversity.student.entity.StudentAttendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface StudentAttendanceRepository extends JpaRepository<StudentAttendance, Long> {
    Optional<StudentAttendance> findByStudentIdAndDate(Long studentId, LocalDate date);
    List<StudentAttendance> findByStudentIdAndDateBetween(Long studentId, LocalDate start, LocalDate end);
}
