package com.smartuniversity.admission.mapper;

import com.smartuniversity.admission.dto.AdmitCardResponse;
import com.smartuniversity.admission.entity.AdmitCard;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AdmitCardMapper {

    @Mapping(target = "applicantId", source = "applicant.id")
    @Mapping(target = "applicationNumber", source = "applicant.applicationNumber")
    AdmitCardResponse toResponse(AdmitCard admitCard);
}
