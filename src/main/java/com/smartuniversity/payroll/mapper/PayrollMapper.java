package com.smartuniversity.payroll.mapper;

import com.smartuniversity.payroll.dto.*;
import com.smartuniversity.payroll.entity.*;
import com.smartuniversity.hrm.entity.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PayrollMapper {

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeName", expression = "java(p.getEmployee().getFirstName() + \" \" + p.getEmployee().getLastName())")
    PayslipResponse toPayslipResponse(Payslip p);
}
