package com.smartuniversity.config;

import com.smartuniversity.common.enums.Permission;
import com.smartuniversity.security.entity.Role;
import com.smartuniversity.security.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        createRoleIfNotExists("ADMIN", "System Administrator", Set.of(Permission.values()));
        createRoleIfNotExists("STUDENT", "Student", Set.of(Permission.USER_READ));
        createRoleIfNotExists("EMPLOYEE", "University Employee", Set.of(Permission.USER_READ, Permission.HRM_READ));
        createRoleIfNotExists("FACULTY", "Faculty Member", Set.of(Permission.USER_READ, Permission.ACADEMIC_READ, Permission.ACADEMIC_WRITE));
        createRoleIfNotExists("HR", "Human Resources", Set.of(Permission.USER_READ, Permission.HRM_READ, Permission.HRM_WRITE, Permission.HRM_APPROVE));
        createRoleIfNotExists("PAYROLL", "Payroll Officer", Set.of(Permission.USER_READ, Permission.PAYROLL_READ, Permission.PAYROLL_WRITE));
        createRoleIfNotExists("ADMISSION", "Admission Officer", Set.of(Permission.USER_READ, Permission.ADMISSION_READ, Permission.ADMISSION_WRITE, Permission.ADMISSION_APPROVE));
        createRoleIfNotExists("APPLICANT", "Applicant", Set.of(Permission.USER_READ, Permission.ADMISSION_READ));
    }

    private void createRoleIfNotExists(String name, String description, Set<Permission> permissions) {
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = Role.builder()
                    .name(name)
                    .description(description)
                    .permissions(permissions)
                    .build();
            roleRepository.save(role);
        }
    }
}
