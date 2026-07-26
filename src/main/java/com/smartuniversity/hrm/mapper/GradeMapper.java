package com.smartuniversity.hrm.mapper;

import com.smartuniversity.hrm.dto.*;
import com.smartuniversity.hrm.entity.*;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GradeMapper {
    GradeResponse toResponse(Grade g);
}
