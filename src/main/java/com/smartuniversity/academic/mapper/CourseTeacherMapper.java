package com.smartuniversity.academic.mapper;

import com.smartuniversity.academic.dto.*;
import com.smartuniversity.academic.entity.CourseTeacher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CourseTeacherMapper {
    @Mapping(target = "courseId", source = "course.id")
    @Mapping(target = "courseName", source = "course.name")
    @Mapping(target = "courseCode", source = "course.courseCode")
    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeName", expression = "java(ct.getEmployee().getFirstName() + \" \" + ct.getEmployee().getLastName())")
    @Mapping(target = "academicSessionId", source = "academicSession.id")
    @Mapping(target = "academicSessionName", source = "academicSession.name")
    CourseTeacherResponse toResponse(CourseTeacher ct);
}
