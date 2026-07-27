package com.smartuniversity.student.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalTime;

@Data
public class StudentAttendanceRequest {
    @NotNull
    private Long studentId;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
}
