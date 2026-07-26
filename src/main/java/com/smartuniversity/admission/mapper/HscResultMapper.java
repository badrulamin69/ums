package com.smartuniversity.admission.mapper;

import com.smartuniversity.admission.dto.HscResultRequest;
import com.smartuniversity.admission.dto.HscResultResponse;
import com.smartuniversity.admission.entity.HscResult;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface HscResultMapper {
    @Mapping(target = "applicantId", source = "applicant.id")
    @Mapping(target = "group", source = "studentGroup")
    HscResultResponse toResponse(HscResult result);

    @Mapping(target = "applicant", ignore = true)
    @Mapping(target = "verified", ignore = true)
    @Mapping(target = "studentGroup", source = "group")
    HscResult toEntity(HscResultRequest request);
}
