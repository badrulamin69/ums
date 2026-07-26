package com.smartuniversity.academic.mapper;

import com.smartuniversity.academic.dto.*;
import com.smartuniversity.academic.entity.StudentResult;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface StudentResultMapper {
    @Mapping(target = "studentId", source = "student.id")
    @Mapping(target = "studentName", expression = "java(result.getStudent().getFirstName() + \" \" + result.getStudent().getLastName())")
    @Mapping(target = "courseId", source = "course.id")
    @Mapping(target = "courseName", source = "course.name")
    @Mapping(target = "courseCode", source = "course.courseCode")
    @Mapping(target = "academicSessionId", source = "academicSession.id")
    @Mapping(target = "academicSessionName", source = "academicSession.name")
    StudentResultResponse toResponse(StudentResult result);
}
