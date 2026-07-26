package com.smartuniversity.hrm.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalTime;

@Data
public class AttendanceRequest {
    @NotNull
    private Long employeeId;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
}
