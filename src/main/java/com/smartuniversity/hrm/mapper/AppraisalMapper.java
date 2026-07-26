package com.smartuniversity.hrm.mapper;

import com.smartuniversity.hrm.dto.*;
import com.smartuniversity.hrm.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AppraisalMapper {
    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeName", expression = "java(a.getEmployee().getFirstName() + \" \" + a.getEmployee().getLastName())")
    @Mapping(target = "reviewerId", source = "reviewer.id")
    @Mapping(target = "reviewerName", expression = "java(a.getReviewer() != null ? a.getReviewer().getFirstName() + \" \" + a.getReviewer().getLastName() : null)")
    AppraisalResponse toResponse(Appraisal a);
}
