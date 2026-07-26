package com.smartuniversity.academic.mapper;

import com.smartuniversity.academic.dto.*;
import com.smartuniversity.academic.entity.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CourseMapper {
    @Mapping(target = "yearLevelId", source = "yearLevel.id")
    @Mapping(target = "yearNumber", source = "yearLevel.yearNumber")
    CourseResponse toResponse(Course course);
}
