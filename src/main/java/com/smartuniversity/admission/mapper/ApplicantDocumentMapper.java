package com.smartuniversity.admission.mapper;

import com.smartuniversity.admission.dto.ApplicantDocumentRequest;
import com.smartuniversity.admission.dto.ApplicantDocumentResponse;
import com.smartuniversity.admission.entity.ApplicantDocument;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ApplicantDocumentMapper {

    @Mapping(target = "applicantId", source = "applicant.id")
    ApplicantDocumentResponse toResponse(ApplicantDocument document);

    @Mapping(target = "applicant", ignore = true)
    ApplicantDocument toEntity(ApplicantDocumentRequest request);
}
