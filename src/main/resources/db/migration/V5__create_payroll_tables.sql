CREATE TABLE salary_structures (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    grade_id BIGINT NOT NULL UNIQUE,
    basic_salary DECIMAL(12, 2) NOT NULL,
    house_allowance DECIMAL(12, 2) NOT NULL,
    medical_allowance DECIMAL(12, 2) NOT NULL,
    transport_allowance DECIMAL(12, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) NOT NULL,
    provident_fund_rate DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_ss_grade FOREIGN KEY (grade_id) REFERENCES grades(id)
);

CREATE TABLE payroll_runs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    month VARCHAR(20) NOT NULL,
    year INT NOT NULL,
    run_date DATE NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    total_employees INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (month, year)
);

CREATE TABLE payslips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payroll_run_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    basic_salary DECIMAL(12, 2) NOT NULL,
    house_allowance DECIMAL(12, 2) NOT NULL,
    medical_allowance DECIMAL(12, 2) NOT NULL,
    transport_allowance DECIMAL(12, 2) NOT NULL,
    gross_salary DECIMAL(12, 2) NOT NULL,
    tax_deduction DECIMAL(12, 2) NOT NULL,
    provident_fund_deduction DECIMAL(12, 2) NOT NULL,
    net_salary DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_payslip_run FOREIGN KEY (payroll_run_id) REFERENCES payroll_runs(id),
    CONSTRAINT fk_payslip_employee FOREIGN KEY (employee_id) REFERENCES employees(id)
);
