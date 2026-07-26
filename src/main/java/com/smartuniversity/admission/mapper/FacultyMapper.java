package com.smartuniversity.admission.mapper;

import com.smartuniversity.admission.dto.FacultyRequest;
import com.smartuniversity.admission.dto.FacultyResponse;
import com.smartuniversity.admission.entity.Faculty;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface FacultyMapper {

    FacultyResponse toResponse(Faculty faculty);

    Faculty toEntity(FacultyRequest request);

    void updateFromRequest(FacultyRequest request, @MappingTarget Faculty faculty);
}
