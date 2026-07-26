package com.smartuniversity.academic.mapper;

import com.smartuniversity.academic.dto.*;
import com.smartuniversity.academic.entity.YearLevel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface YearLevelMapper {
    @Mapping(target = "departmentId", source = "department.id")
    @Mapping(target = "departmentName", source = "department.name")
    YearLevelResponse toResponse(YearLevel yearLevel);
}
