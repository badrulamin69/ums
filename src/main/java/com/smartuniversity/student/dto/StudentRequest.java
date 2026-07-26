package com.smartuniversity.student.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StudentRequest {
    @NotBlank
    private String firstName;
    private String middleName;
    @NotBlank
    private String lastName;
}
