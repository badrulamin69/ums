package com.smartuniversity.academic.service;

import com.smartuniversity.academic.dto.*;
import com.smartuniversity.academic.entity.*;
import com.smartuniversity.academic.mapper.CourseTeacherMapper;
import com.smartuniversity.academic.repository.*;
import com.smartuniversity.common.exception.BadRequestException;
import com.smartuniversity.common.exception.ResourceNotFoundException;
import com.smartuniversity.hrm.entity.Employee;
import com.smartuniversity.hrm.repository.EmployeeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseTeacherService {

    private final CourseTeacherRepository courseTeacherRepository;
    private final CourseRepository courseRepository;
    private final EmployeeRepository employeeRepository;
    private final AcademicSessionRepository sessionRepository;
    private final CourseTeacherMapper mapper;

    public CourseTeacherService(CourseTeacherRepository courseTeacherRepository,
                                CourseRepository courseRepository,
                                EmployeeRepository employeeRepository,
                                AcademicSessionRepository sessionRepository,
                                CourseTeacherMapper mapper) {
        this.courseTeacherRepository = courseTeacherRepository;
        this.courseRepository = courseRepository;
        this.employeeRepository = employeeRepository;
        this.sessionRepository = sessionRepository;
        this.mapper = mapper;
    }

    @Transactional
    public CourseTeacherResponse assign(CourseTeacherRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", request.getCourseId()));
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", request.getEmployeeId()));
        AcademicSession session = sessionRepository.findById(request.getAcademicSessionId())
                .orElseThrow(() -> new ResourceNotFoundException("AcademicSession", "id", request.getAcademicSessionId()));

        CourseTeacher ct = CourseTeacher.builder()
                .course(course)
                .employee(employee)
                .academicSession(session)
                .build();
        ct = courseTeacherRepository.save(ct);
        return mapper.toResponse(ct);
    }

    public Page<CourseTeacherResponse> getAll(Pageable pageable) {
        return courseTeacherRepository.findAll(pageable).map(mapper::toResponse);
    }

    public List<CourseTeacherResponse> getBySession(Long sessionId) {
        return courseTeacherRepository.findByAcademicSessionId(sessionId).stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<CourseTeacherResponse> getByEmployee(Long employeeId) {
        return courseTeacherRepository.findByEmployeeId(employeeId).stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void remove(Long id) {
        courseTeacherRepository.deleteById(id);
    }
}
