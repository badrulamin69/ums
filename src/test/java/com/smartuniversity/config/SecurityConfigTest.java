package com.smartuniversity.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
class SecurityConfigTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc buildMockMvc() {
        return MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @Test
    void unauthenticatedGetToStudentsShouldBeBlocked() throws Exception {
        buildMockMvc().perform(get("/api/students"))
                .andExpect(status().isForbidden());
    }

    @Test
    void unauthenticatedGetToStudentsByIdShouldBeBlocked() throws Exception {
        buildMockMvc().perform(get("/api/students/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    void unauthenticatedGetToEmployeesShouldBeBlocked() throws Exception {
        buildMockMvc().perform(get("/api/employees"))
                .andExpect(status().isForbidden());
    }

    @Test
    void unauthenticatedGetToYearResultsShouldBeBlocked() throws Exception {
        buildMockMvc().perform(get("/api/year-results/student/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    void unauthenticatedGetToNotificationsShouldBeBlocked() throws Exception {
        buildMockMvc().perform(get("/api/notifications"))
                .andExpect(status().isForbidden());
    }

    @Test
    void unauthenticatedGetToFacultiesShouldReturnOk() throws Exception {
        buildMockMvc().perform(get("/api/faculties"))
                .andExpect(status().isOk());
    }

    @Test
    void unauthenticatedGetToDepartmentsShouldReturnOk() throws Exception {
        buildMockMvc().perform(get("/api/departments"))
                .andExpect(status().isOk());
    }

    @Test
    void unauthenticatedGetToAdmissionCircularsShouldReturnOk() throws Exception {
        buildMockMvc().perform(get("/api/admission-circulars"))
                .andExpect(status().isOk());
    }

    @Test
    void unauthenticatedGetToDocumentTypesShouldReturnOk() throws Exception {
        buildMockMvc().perform(get("/api/document-types"))
                .andExpect(status().isOk());
    }

    @Test
    void unauthenticatedGetToPayrollShouldBeBlocked() throws Exception {
        buildMockMvc().perform(get("/api/payroll/runs/1/payslips"))
                .andExpect(status().isForbidden());
    }

    @Test
    void unauthenticatedGetToAttendanceShouldBeBlocked() throws Exception {
        buildMockMvc().perform(get("/api/attendance/employee/1")
                        .param("start", "2026-01-01")
                        .param("end", "2026-12-31"))
                .andExpect(status().isForbidden());
    }

    @Test
    void unauthenticatedGetToApplicantsShouldBeBlocked() throws Exception {
        buildMockMvc().perform(get("/api/applicants/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    void unauthenticatedGetToAuditLogsShouldBeBlocked() throws Exception {
        buildMockMvc().perform(get("/api/audit-logs"))
                .andExpect(status().isForbidden());
    }

    @Test
    void unauthenticatedGetToPaymentByTransactionIdShouldBeBlocked() throws Exception {
        buildMockMvc().perform(get("/api/payments/TXN-ABC123"))
                .andExpect(status().isForbidden());
    }

    @Test
    void unauthenticatedGetToStudentByRegNoShouldBeBlocked() throws Exception {
        buildMockMvc().perform(get("/api/students/registration/REG-001"))
                .andExpect(status().isForbidden());
    }
}
