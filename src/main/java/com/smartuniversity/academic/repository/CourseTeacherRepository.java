package com.smartuniversity.academic.repository;

import com.smartuniversity.academic.entity.CourseTeacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseTeacherRepository extends JpaRepository<CourseTeacher, Long> {
    List<CourseTeacher> findByCourseId(Long courseId);
    List<CourseTeacher> findByEmployeeId(Long employeeId);
    List<CourseTeacher> findByAcademicSessionId(Long sessionId);
}
