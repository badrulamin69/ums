package com.smartuniversity.hrm.dto;

import com.smartuniversity.common.enums.EmployeeType;
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
public class EmployeeResponse {
    private Long id;
    private Long userId;
    private String employeeId;
    private String firstName;
    private String middleName;
    private String lastName;
    private String phone;
    private Gender gender;
    private LocalDate dateOfBirth;
    private EmployeeType employeeType;
    private Long designationId;
    private String designationName;
    private Long gradeId;
    private String gradeName;
    private String department;
    private boolean active;
}
