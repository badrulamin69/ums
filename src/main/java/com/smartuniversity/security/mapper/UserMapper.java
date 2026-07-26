package com.smartuniversity.security.mapper;

import com.smartuniversity.security.dto.UserResponse;
import com.smartuniversity.security.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "roles", expression = "java(mapRoles(user))")
    UserResponse toResponse(User user);

    default Set<String> mapRoles(User user) {
        return user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toSet());
    }
}
