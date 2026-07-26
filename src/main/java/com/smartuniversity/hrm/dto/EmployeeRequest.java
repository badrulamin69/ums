package com.smartuniversity.hrm.dto;

import com.smartuniversity.common.enums.EmployeeType;
import com.smartuniversity.common.enums.Gender;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EmployeeRequest {

    @NotNull
    private Long userId;

    @NotBlank
    private String firstName;
    private String middleName;
    @NotBlank
    private String lastName;

    @NotBlank
    @Pattern(regexp = "^\\+?[0-9]{10,15}$")
    private String phone;

    @NotNull
    private Gender gender;

    @NotNull
    private LocalDate dateOfBirth;

    @NotNull
    private EmployeeType employeeType;

    private Long designationId;
    private Long gradeId;
    private String department;
}
