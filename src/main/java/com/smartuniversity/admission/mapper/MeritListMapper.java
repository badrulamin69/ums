package com.smartuniversity.admission.mapper;

import com.smartuniversity.admission.dto.MeritListResponse;
import com.smartuniversity.admission.entity.MeritList;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MeritListMapper {

    @Mapping(target = "circularId", source = "circular.id")
    @Mapping(target = "departmentId", source = "department.id")
    @Mapping(target = "departmentName", source = "department.name")
    @Mapping(target = "applicantId", source = "applicant.id")
    @Mapping(target = "applicantName", expression = "java(merit.getApplicant().getFirstName() + \" \" + merit.getApplicant().getLastName())")
    @Mapping(target = "applicationNumber", source = "applicant.applicationNumber")
    MeritListResponse toResponse(MeritList merit);
}
