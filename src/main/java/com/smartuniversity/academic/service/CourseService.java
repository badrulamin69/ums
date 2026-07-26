package com.smartuniversity.academic.service;

import com.smartuniversity.academic.dto.*;
import com.smartuniversity.academic.entity.Course;
import com.smartuniversity.academic.entity.YearLevel;
import com.smartuniversity.academic.mapper.CourseMapper;
import com.smartuniversity.academic.repository.CourseRepository;
import com.smartuniversity.academic.repository.YearLevelRepository;
import com.smartuniversity.common.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final YearLevelRepository yearLevelRepository;
    private final CourseMapper courseMapper;

    public CourseService(CourseRepository courseRepository, YearLevelRepository yearLevelRepository,
                         CourseMapper courseMapper) {
        this.courseRepository = courseRepository;
        this.yearLevelRepository = yearLevelRepository;
        this.courseMapper = courseMapper;
    }

    @Transactional
    public CourseResponse create(CourseRequest request) {
        YearLevel yearLevel = yearLevelRepository.findById(request.getYearLevelId())
                .orElseThrow(() -> new ResourceNotFoundException("YearLevel", "id", request.getYearLevelId()));
        Course course = Course.builder()
                .courseCode(request.getCourseCode())
                .name(request.getName())
                .creditHours(request.getCreditHours())
                .yearLevel(yearLevel)
                .build();
        course = courseRepository.save(course);
        return courseMapper.toResponse(course);
    }

    public CourseResponse getById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
        return courseMapper.toResponse(course);
    }

    public Page<CourseResponse> getAll(Pageable pageable) {
        return courseRepository.findAll(pageable).map(courseMapper::toResponse);
    }

    public List<CourseResponse> getByYearLevelId(Long yearLevelId) {
        return courseRepository.findByYearLevelId(yearLevelId).stream()
                .map(courseMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<CourseResponse> getByDepartmentId(Long departmentId) {
        return courseRepository.findByYearLevelDepartmentId(departmentId).stream()
                .map(courseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CourseResponse update(Long id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
        course.setCourseCode(request.getCourseCode());
        course.setName(request.getName());
        course.setCreditHours(request.getCreditHours());
        if (request.getYearLevelId() != null) {
            YearLevel yearLevel = yearLevelRepository.findById(request.getYearLevelId())
                    .orElseThrow(() -> new ResourceNotFoundException("YearLevel", "id", request.getYearLevelId()));
            course.setYearLevel(yearLevel);
        }
        course = courseRepository.save(course);
        return courseMapper.toResponse(course);
    }
}
