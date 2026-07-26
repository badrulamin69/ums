package com.smartuniversity.security;

import com.smartuniversity.admission.entity.Applicant;
import com.smartuniversity.admission.repository.ApplicantRepository;
import com.smartuniversity.hrm.entity.Employee;
import com.smartuniversity.hrm.repository.EmployeeRepository;
import com.smartuniversity.notification.entity.NotificationEvent;
import com.smartuniversity.notification.repository.NotificationRepository;
import com.smartuniversity.payment.entity.Payment;
import com.smartuniversity.payment.repository.PaymentRepository;
import com.smartuniversity.security.entity.User;
import com.smartuniversity.security.repository.UserRepository;
import com.smartuniversity.student.entity.Student;
import com.smartuniversity.student.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ResourceSecurityTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private ApplicantRepository applicantRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @InjectMocks
    private ResourceSecurity resourceSecurity;

    private User user;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .email("test@smart.edu")
                .password("encoded")
                .enabled(true)
                .accountNonLocked(true)
                .roles(Set.of())
                .build();

        userDetails = org.springframework.security.core.userdetails.User.builder()
                .username("test@smart.edu")
                .password("encoded")
                .authorities(Set.of())
                .build();

        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    void isOwner_shouldReturnTrueForMatchingUser() {
        when(userRepository.findByEmail("test@smart.edu")).thenReturn(Optional.of(user));
        assertTrue(resourceSecurity.isOwner(1L));
    }

    @Test
    void isOwner_shouldReturnFalseForNonMatchingUser() {
        when(userRepository.findByEmail("test@smart.edu")).thenReturn(Optional.of(user));
        assertFalse(resourceSecurity.isOwner(99L));
    }

    @Test
    void isStudentOwner_shouldReturnTrueWhenUserOwnsStudent() {
        Student student = Student.builder()
                .id(10L)
                .user(user)
                .registrationNumber("REG-001")
                .firstName("John")
                .lastName("Doe")
                .cgpa(0.0)
                .active(true)
                .build();

        when(studentRepository.findById(10L)).thenReturn(Optional.of(student));
        when(userRepository.findByEmail("test@smart.edu")).thenReturn(Optional.of(user));

        assertTrue(resourceSecurity.isStudentOwner(10L));
    }

    @Test
    void isStudentOwner_shouldReturnFalseWhenUserDoesNotOwnStudent() {
        User otherUser = User.builder()
                .id(2L)
                .email("other@smart.edu")
                .password("encoded")
                .enabled(true)
                .accountNonLocked(true)
                .roles(Set.of())
                .build();

        Student student = Student.builder()
                .id(10L)
                .user(otherUser)
                .registrationNumber("REG-002")
                .firstName("Jane")
                .lastName("Doe")
                .cgpa(0.0)
                .active(true)
                .build();

        when(studentRepository.findById(10L)).thenReturn(Optional.of(student));
        when(userRepository.findByEmail("test@smart.edu")).thenReturn(Optional.of(user));

        assertFalse(resourceSecurity.isStudentOwner(10L));
    }

    @Test
    void isApplicantOwner_shouldReturnTrueWhenUserOwnsApplicant() {
        Applicant applicant = Applicant.builder()
                .id(5L)
                .user(user)
                .firstName("Test")
                .lastName("Applicant")
                .phone("01700000000")
                .build();

        when(applicantRepository.findById(5L)).thenReturn(Optional.of(applicant));
        when(userRepository.findByEmail("test@smart.edu")).thenReturn(Optional.of(user));

        assertTrue(resourceSecurity.isApplicantOwner(5L));
    }

    @Test
    void isApplicantOwner_shouldReturnFalseWhenUserDoesNotOwnApplicant() {
        User otherUser = User.builder()
                .id(2L)
                .email("other@smart.edu")
                .password("encoded")
                .enabled(true)
                .accountNonLocked(true)
                .roles(Set.of())
                .build();

        Applicant applicant = Applicant.builder()
                .id(5L)
                .user(otherUser)
                .firstName("Other")
                .lastName("Applicant")
                .phone("01800000000")
                .build();

        when(applicantRepository.findById(5L)).thenReturn(Optional.of(applicant));
        when(userRepository.findByEmail("test@smart.edu")).thenReturn(Optional.of(user));

        assertFalse(resourceSecurity.isApplicantOwner(5L));
    }

    @Test
    void isEmployeeOwner_shouldReturnTrueWhenUserOwnsEmployee() {
        Employee employee = Employee.builder()
                .id(3L)
                .user(user)
                .employeeId("EMP-001")
                .firstName("Test")
                .lastName("Employee")
                .phone("01900000000")
                .build();

        when(employeeRepository.findById(3L)).thenReturn(Optional.of(employee));
        when(userRepository.findByEmail("test@smart.edu")).thenReturn(Optional.of(user));

        assertTrue(resourceSecurity.isEmployeeOwner(3L));
    }

    @Test
    void isEmployeeOwner_shouldReturnFalseWhenUserDoesNotOwnEmployee() {
        User otherUser = User.builder()
                .id(2L)
                .email("other@smart.edu")
                .password("encoded")
                .enabled(true)
                .accountNonLocked(true)
                .roles(Set.of())
                .build();

        Employee employee = Employee.builder()
                .id(3L)
                .user(otherUser)
                .employeeId("EMP-002")
                .firstName("Other")
                .lastName("Employee")
                .phone("01600000000")
                .build();

        when(employeeRepository.findById(3L)).thenReturn(Optional.of(employee));
        when(userRepository.findByEmail("test@smart.edu")).thenReturn(Optional.of(user));

        assertFalse(resourceSecurity.isEmployeeOwner(3L));
    }

    @Test
    void isNotificationOwner_shouldReturnTrueWhenUserOwnsNotification() {
        NotificationEvent notification = NotificationEvent.builder()
                .id(7L)
                .userId(1L)
                .build();

        when(notificationRepository.findById(7L)).thenReturn(Optional.of(notification));
        when(userRepository.findByEmail("test@smart.edu")).thenReturn(Optional.of(user));

        assertTrue(resourceSecurity.isNotificationOwner(7L));
    }

    @Test
    void isNotificationOwner_shouldReturnFalseWhenUserDoesNotOwnNotification() {
        NotificationEvent notification = NotificationEvent.builder()
                .id(7L)
                .userId(99L)
                .build();

        when(notificationRepository.findById(7L)).thenReturn(Optional.of(notification));
        when(userRepository.findByEmail("test@smart.edu")).thenReturn(Optional.of(user));

        assertFalse(resourceSecurity.isNotificationOwner(7L));
    }

    @Test
    void hasRole_shouldReturnTrueForExistingRole() {
        UserDetails adminUser = org.springframework.security.core.userdetails.User.builder()
                .username("admin@smart.edu")
                .password("encoded")
                .authorities("ROLE_ADMIN")
                .build();

        Authentication auth = new UsernamePasswordAuthenticationToken(adminUser, null, adminUser.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        assertTrue(resourceSecurity.hasRole("ADMIN"));
    }

    @Test
    void hasRole_shouldReturnFalseForMissingRole() {
        assertFalse(resourceSecurity.hasRole("ADMIN"));
    }

    @Test
    void isEmailOwner_shouldReturnTrueForMatchingEmail() {
        assertTrue(resourceSecurity.isEmailOwner("test@smart.edu"));
    }

    @Test
    void isEmailOwner_shouldReturnFalseForNonMatchingEmail() {
        assertFalse(resourceSecurity.isEmailOwner("other@smart.edu"));
    }

    @Test
    void isPaymentOwner_shouldReturnTrueWhenUserOwnsPayment() {
        Payment payment = Payment.builder()
                .id(1L)
                .transactionId("TXN-ABC123")
                .amount(BigDecimal.valueOf(5000))
                .currency("BDT")
                .user(user)
                .build();

        when(paymentRepository.findByTransactionId("TXN-ABC123")).thenReturn(Optional.of(payment));
        when(userRepository.findByEmail("test@smart.edu")).thenReturn(Optional.of(user));

        assertTrue(resourceSecurity.isPaymentOwner("TXN-ABC123"));
    }

    @Test
    void isPaymentOwner_shouldReturnFalseWhenUserDoesNotOwnPayment() {
        User otherUser = User.builder()
                .id(2L)
                .email("other@smart.edu")
                .password("encoded")
                .enabled(true)
                .accountNonLocked(true)
                .roles(Set.of())
                .build();

        Payment payment = Payment.builder()
                .id(1L)
                .transactionId("TXN-ABC123")
                .amount(BigDecimal.valueOf(5000))
                .currency("BDT")
                .user(otherUser)
                .build();

        when(paymentRepository.findByTransactionId("TXN-ABC123")).thenReturn(Optional.of(payment));
        when(userRepository.findByEmail("test@smart.edu")).thenReturn(Optional.of(user));

        assertFalse(resourceSecurity.isPaymentOwner("TXN-ABC123"));
    }

    @Test
    void isPaymentOwner_shouldReturnFalseWhenTransactionNotFound() {
        when(paymentRepository.findByTransactionId("TXN-NONE")).thenReturn(Optional.empty());

        assertFalse(resourceSecurity.isPaymentOwner("TXN-NONE"));
    }

    @Test
    void isStudentOwnerByRegNo_shouldReturnTrueWhenUserOwnsStudent() {
        Student student = Student.builder()
                .id(10L)
                .user(user)
                .registrationNumber("REG-001")
                .firstName("John")
                .lastName("Doe")
                .cgpa(0.0)
                .active(true)
                .build();

        when(studentRepository.findByRegistrationNumber("REG-001")).thenReturn(Optional.of(student));
        when(userRepository.findByEmail("test@smart.edu")).thenReturn(Optional.of(user));

        assertTrue(resourceSecurity.isStudentOwnerByRegNo("REG-001"));
    }

    @Test
    void isStudentOwnerByRegNo_shouldReturnFalseWhenUserDoesNotOwnStudent() {
        User otherUser = User.builder()
                .id(2L)
                .email("other@smart.edu")
                .password("encoded")
                .enabled(true)
                .accountNonLocked(true)
                .roles(Set.of())
                .build();

        Student student = Student.builder()
                .id(10L)
                .user(otherUser)
                .registrationNumber("REG-002")
                .firstName("Jane")
                .lastName("Doe")
                .cgpa(0.0)
                .active(true)
                .build();

        when(studentRepository.findByRegistrationNumber("REG-002")).thenReturn(Optional.of(student));
        when(userRepository.findByEmail("test@smart.edu")).thenReturn(Optional.of(user));

        assertFalse(resourceSecurity.isStudentOwnerByRegNo("REG-002"));
    }

    @Test
    void isStudentOwnerByRegNo_shouldReturnFalseWhenRegNoNotFound() {
        when(studentRepository.findByRegistrationNumber("REG-NONE")).thenReturn(Optional.empty());

        assertFalse(resourceSecurity.isStudentOwnerByRegNo("REG-NONE"));
    }
}
