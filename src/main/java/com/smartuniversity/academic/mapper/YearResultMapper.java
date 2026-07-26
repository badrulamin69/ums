package com.smartuniversity.academic.mapper;

import com.smartuniversity.academic.dto.YearResultResponse;
import com.smartuniversity.academic.entity.YearResult;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface YearResultMapper {
    @Mapping(target = "studentId", source = "student.id")
    @Mapping(target = "yearLevelId", source = "yearLevel.id")
    @Mapping(target = "yearNumber", source = "yearLevel.yearNumber")
    @Mapping(target = "academicSessionId", source = "academicSession.id")
    @Mapping(target = "academicSessionName", source = "academicSession.name")
    YearResultResponse toResponse(YearResult yearResult);
}
