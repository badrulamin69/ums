package com.smartuniversity.admission.mapper;

import com.smartuniversity.admission.dto.AdmissionCircularRequest;
import com.smartuniversity.admission.dto.AdmissionCircularResponse;
import com.smartuniversity.admission.entity.AdmissionCircular;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AdmissionCircularMapper {

    @Mapping(target = "facultyId", source = "faculty.id")
    @Mapping(target = "facultyName", source = "faculty.name")
    AdmissionCircularResponse toResponse(AdmissionCircular circular);

    @Mapping(target = "faculty", ignore = true)
    AdmissionCircular toEntity(AdmissionCircularRequest request);

    void updateFromRequest(AdmissionCircularRequest request, @MappingTarget AdmissionCircular circular);
}
