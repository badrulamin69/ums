package com.smartuniversity.academic.mapper;

import com.smartuniversity.academic.dto.*;
import com.smartuniversity.academic.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AcademicSessionMapper {
    AcademicSessionResponse toResponse(AcademicSession session);
    AcademicSession toEntity(AcademicSessionRequest request);
}
