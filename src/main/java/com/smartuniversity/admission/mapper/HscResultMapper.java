package com.smartuniversity.admission.mapper;

import com.smartuniversity.admission.dto.HscResultRequest;
import com.smartuniversity.admission.dto.HscResultResponse;
import com.smartuniversity.admission.entity.HscResult;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface HscResultMapper {
    @Mapping(target = "applicantId", source = "applicant.id")
    HscResultResponse toResponse(HscResult result);

    @Mapping(target = "applicant", ignore = true)
    @Mapping(target = "verified", ignore = true)
    HscResult toEntity(HscResultRequest request);
}
