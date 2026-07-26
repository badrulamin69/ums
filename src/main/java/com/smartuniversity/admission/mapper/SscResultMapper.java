package com.smartuniversity.admission.mapper;

import com.smartuniversity.admission.dto.SscResultRequest;
import com.smartuniversity.admission.dto.SscResultResponse;
import com.smartuniversity.admission.entity.SscResult;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SscResultMapper {
    @Mapping(target = "applicantId", source = "applicant.id")
    SscResultResponse toResponse(SscResult result);

    @Mapping(target = "applicant", ignore = true)
    @Mapping(target = "verified", ignore = true)
    SscResult toEntity(SscResultRequest request);
}
