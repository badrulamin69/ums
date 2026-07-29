package com.smartuniversity.admission.dto;

import lombok.Data;

@Data
public class ApplicantProfileUpdateRequest {

    private String phone;
    private String address;
    private Long preferredDepartmentId;
}
