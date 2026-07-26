package com.smartuniversity.admission.dto;

import com.smartuniversity.common.enums.AdmissionStatus;
import com.smartuniversity.common.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicantResponse {

    private Long id;
    private String firstName;
    private String middleName;
    private String lastName;
    private String phone;
    private Gender gender;
    private LocalDate dateOfBirth;
    private String address;
    private Long circularId;
    private String circularTitle;
    private Long preferredDepartmentId;
    private String preferredDepartmentName;
    private AdmissionStatus status;
    private boolean emailVerified;
    private boolean paymentCompleted;
    private String applicationNumber;
    private Double meritScore;
}
