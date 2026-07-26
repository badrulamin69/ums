package com.smartuniversity.hrm.mapper;

import com.smartuniversity.hrm.dto.*;
import com.smartuniversity.hrm.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "designationId", source = "designation.id")
    @Mapping(target = "designationName", expression = "java(emp.getDesignation() != null ? emp.getDesignation().getName() : null)")
    @Mapping(target = "gradeId", source = "grade.id")
    @Mapping(target = "gradeName", expression = "java(emp.getGrade() != null ? emp.getGrade().getName() : null)")
    EmployeeResponse toResponse(Employee emp);
}
