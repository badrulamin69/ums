CREATE TABLE promotion_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    from_designation_id BIGINT,
    to_designation_id BIGINT,
    from_grade_id BIGINT,
    to_grade_id BIGINT,
    type VARCHAR(20) NOT NULL,
    effective_date DATE NOT NULL,
    remarks VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_promo_employee FOREIGN KEY (employee_id) REFERENCES employees(id),
    CONSTRAINT fk_promo_from_desig FOREIGN KEY (from_designation_id) REFERENCES designations(id),
    CONSTRAINT fk_promo_to_desig FOREIGN KEY (to_designation_id) REFERENCES designations(id),
    CONSTRAINT fk_promo_from_grade FOREIGN KEY (from_grade_id) REFERENCES grades(id),
    CONSTRAINT fk_promo_to_grade FOREIGN KEY (to_grade_id) REFERENCES grades(id)
);

CREATE TABLE approval_workflows (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    comments VARCHAR(500),
    initiated_by BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_wf_initiator FOREIGN KEY (initiated_by) REFERENCES employees(id)
);

CREATE TABLE approval_steps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    workflow_id BIGINT NOT NULL,
    step_order INT NOT NULL,
    approver_role VARCHAR(50) NOT NULL,
    approver_employee_id BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    comments VARCHAR(500),
    decided_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_step_workflow FOREIGN KEY (workflow_id) REFERENCES approval_workflows(id),
    CONSTRAINT fk_step_approver FOREIGN KEY (approver_employee_id) REFERENCES employees(id)
);

CREATE TABLE leave_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    default_days_per_year INT NOT NULL,
    paid BOOLEAN NOT NULL DEFAULT TRUE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE leave_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    leave_type_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL,
    reason VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    workflow_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_lr_employee FOREIGN KEY (employee_id) REFERENCES employees(id),
    CONSTRAINT fk_lr_type FOREIGN KEY (leave_type_id) REFERENCES leave_types(id),
    CONSTRAINT fk_lr_workflow FOREIGN KEY (workflow_id) REFERENCES approval_workflows(id)
);

CREATE TABLE leave_balances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    leave_type_id BIGINT NOT NULL,
    year INT NOT NULL,
    total_days INT NOT NULL,
    used_days INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (employee_id, leave_type_id, year),
    CONSTRAINT fk_lb_employee FOREIGN KEY (employee_id) REFERENCES employees(id),
    CONSTRAINT fk_lb_type FOREIGN KEY (leave_type_id) REFERENCES leave_types(id)
);

CREATE TABLE attendances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (employee_id, date),
    CONSTRAINT fk_att_employee FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE appraisals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    appraisal_date DATE NOT NULL,
    review_year INT NOT NULL,
    rating VARCHAR(30) NOT NULL,
    comments VARCHAR(1000),
    reviewer_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_appr_employee FOREIGN KEY (employee_id) REFERENCES employees(id),
    CONSTRAINT fk_appr_reviewer FOREIGN KEY (reviewer_id) REFERENCES employees(id)
);

CREATE TABLE job_postings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(2000),
    department VARCHAR(100) NOT NULL,
    vacancies INT NOT NULL,
    posting_date DATE NOT NULL,
    closing_date DATE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE job_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_posting_id BIGINT NOT NULL,
    applicant_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    resume_url VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_ja_posting FOREIGN KEY (job_posting_id) REFERENCES job_postings(id)
);

CREATE TABLE interviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_application_id BIGINT NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    location VARCHAR(255),
    notes VARCHAR(500),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    score DOUBLE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_int_application FOREIGN KEY (job_application_id) REFERENCES job_applications(id)
);

CREATE TABLE separations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    type VARCHAR(30) NOT NULL,
    effective_date DATE NOT NULL,
    reason VARCHAR(500),
    approved BOOLEAN NOT NULL DEFAULT FALSE,
    workflow_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sep_employee FOREIGN KEY (employee_id) REFERENCES employees(id),
    CONSTRAINT fk_sep_workflow FOREIGN KEY (workflow_id) REFERENCES approval_workflows(id)
);
