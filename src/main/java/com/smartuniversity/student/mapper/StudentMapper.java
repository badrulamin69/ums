package com.smartuniversity.student.mapper;

import com.smartuniversity.student.dto.StudentResponse;
import com.smartuniversity.student.entity.Student;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface StudentMapper {
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "applicantId", expression = "java(student.getApplicant() != null ? student.getApplicant().getId() : null)")
    StudentResponse toResponse(Student student);
}
