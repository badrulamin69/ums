package com.smartuniversity.hrm.service;

import com.smartuniversity.common.enums.AttendanceStatus;
import com.smartuniversity.common.exception.ResourceNotFoundException;
import com.smartuniversity.hrm.dto.AttendanceRequest;
import com.smartuniversity.hrm.dto.AttendanceResponse;
import com.smartuniversity.hrm.entity.Attendance;
import com.smartuniversity.hrm.entity.Employee;
import com.smartuniversity.hrm.repository.AttendanceRepository;
import com.smartuniversity.hrm.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceSecurityTest {

    @Mock
    private AttendanceRepository attendanceRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private AttendanceService attendanceService;

    private Employee employee;
    private Employee otherEmployee;

    @BeforeEach
    void setUp() {
        employee = Employee.builder()
                .id(1L)
                .employeeId("EMP-001")
                .firstName("Test")
                .lastName("Employee")
                .phone("01700000000")
                .build();

        otherEmployee = Employee.builder()
                .id(2L)
                .employeeId("EMP-002")
                .firstName("Other")
                .lastName("Employee")
                .phone("01800000000")
                .build();
    }

    @Test
    void checkInForUser_shouldResolveEmployeeByUserId_notByRequestBody() {
        AttendanceRequest request = new AttendanceRequest();
        request.setEmployeeId(99L);
        request.setCheckInTime(LocalTime.of(9, 0));

        when(employeeRepository.findByUserId(1L)).thenReturn(Optional.of(employee));
        when(attendanceRepository.findByEmployeeIdAndDate(1L, LocalDate.now())).thenReturn(Optional.empty());
        when(attendanceRepository.save(any(Attendance.class))).thenAnswer(inv -> {
            Attendance a = inv.getArgument(0);
            a.setId(10L);
            return a;
        });

        AttendanceResponse response = attendanceService.checkInForUser(1L, request);

        assertEquals(1L, response.getEmployeeId());
        verify(employeeRepository, never()).findById(99L);
        verify(employeeRepository).findByUserId(1L);
    }

    @Test
    void checkInForUser_shouldThrowWhenUserHasNoEmployee() {
        AttendanceRequest request = new AttendanceRequest();
        request.setEmployeeId(1L);
        request.setCheckInTime(LocalTime.of(9, 0));

        when(employeeRepository.findByUserId(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> attendanceService.checkInForUser(99L, request));
    }

    @Test
    void checkOutForUser_shouldResolveEmployeeByUserId() {
        AttendanceRequest request = new AttendanceRequest();
        request.setEmployeeId(99L);
        request.setCheckOutTime(LocalTime.of(17, 0));

        Attendance existing = Attendance.builder()
                .id(10L)
                .employee(employee)
                .date(LocalDate.now())
                .checkInTime(LocalTime.of(9, 0))
                .status(AttendanceStatus.PRESENT)
                .build();

        when(employeeRepository.findByUserId(1L)).thenReturn(Optional.of(employee));
        when(attendanceRepository.findByEmployeeIdAndDate(1L, LocalDate.now())).thenReturn(Optional.of(existing));
        when(attendanceRepository.save(any(Attendance.class))).thenAnswer(inv -> inv.getArgument(0));

        AttendanceResponse response = attendanceService.checkOutForUser(1L, request);

        assertEquals(1L, response.getEmployeeId());
        verify(employeeRepository, never()).findById(99L);
        verify(employeeRepository).findByUserId(1L);
    }

    @Test
    void adminCheckIn_shouldUseEmployeeIdFromBody() {
        AttendanceRequest request = new AttendanceRequest();
        request.setEmployeeId(2L);
        request.setCheckInTime(LocalTime.of(9, 0));

        when(employeeRepository.findById(2L)).thenReturn(Optional.of(otherEmployee));
        when(attendanceRepository.findByEmployeeIdAndDate(2L, LocalDate.now())).thenReturn(Optional.empty());
        when(attendanceRepository.save(any(Attendance.class))).thenAnswer(inv -> {
            Attendance a = inv.getArgument(0);
            a.setId(20L);
            return a;
        });

        AttendanceResponse response = attendanceService.checkIn(request);

        assertEquals(2L, response.getEmployeeId());
        verify(employeeRepository).findById(2L);
    }
}
