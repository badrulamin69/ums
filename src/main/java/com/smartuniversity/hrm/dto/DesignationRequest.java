package com.smartuniversity.hrm.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class DesignationRequest {
    @NotBlank
    private String name;
    private String description;
    @Min(1)
    private int level;
}
