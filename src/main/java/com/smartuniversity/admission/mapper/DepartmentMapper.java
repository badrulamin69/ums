package com.smartuniversity.admission.mapper;

import com.smartuniversity.admission.dto.DepartmentRequest;
import com.smartuniversity.admission.dto.DepartmentResponse;
import com.smartuniversity.admission.entity.Department;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {

    @Mapping(target = "facultyId", source = "faculty.id")
    @Mapping(target = "facultyName", source = "faculty.name")
    DepartmentResponse toResponse(Department department);

    @Mapping(target = "faculty", ignore = true)
    Department toEntity(DepartmentRequest request);

    void updateFromRequest(DepartmentRequest request, @MappingTarget Department department);
}
