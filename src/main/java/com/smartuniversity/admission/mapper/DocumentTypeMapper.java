package com.smartuniversity.admission.mapper;

import com.smartuniversity.admission.dto.DocumentTypeRequest;
import com.smartuniversity.admission.dto.DocumentTypeResponse;
import com.smartuniversity.admission.entity.DocumentType;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DocumentTypeMapper {
    DocumentTypeResponse toResponse(DocumentType type);
    DocumentType toEntity(DocumentTypeRequest request);
    void updateFromRequest(DocumentTypeRequest request, @MappingTarget DocumentType type);
}
