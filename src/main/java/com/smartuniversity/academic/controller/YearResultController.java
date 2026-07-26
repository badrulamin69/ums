package com.smartuniversity.academic.controller;

import com.smartuniversity.academic.dto.YearResultResponse;
import com.smartuniversity.academic.entity.YearResult;
import com.smartuniversity.academic.mapper.YearResultMapper;
import com.smartuniversity.academic.repository.YearResultRepository;
import com.smartuniversity.common.ApiResponse;
import com.smartuniversity.common.exception.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/year-results")
public class YearResultController {

    private final YearResultRepository repository;
    private final YearResultMapper mapper;

    public YearResultController(YearResultRepository repository, YearResultMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<YearResultResponse>>> getByStudent(@PathVariable Long studentId) {
        List<YearResultResponse> results = repository.findByStudentId(studentId).stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(results));
    }
}
