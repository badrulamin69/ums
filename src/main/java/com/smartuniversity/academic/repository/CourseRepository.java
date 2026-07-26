package com.smartuniversity.academic.repository;

import com.smartuniversity.academic.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCourseCode(String courseCode);
    List<Course> findByYearLevelId(Long yearLevelId);
    List<Course> findByYearLevelDepartmentId(Long departmentId);
}
