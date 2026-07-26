package com.smartuniversity.hrm.mapper;

import com.smartuniversity.hrm.dto.*;
import com.smartuniversity.hrm.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SeparationMapper {
    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeName", expression = "java(s.getEmployee().getFirstName() + \" \" + s.getEmployee().getLastName())")
    SeparationResponse toResponse(Separation s);
}
