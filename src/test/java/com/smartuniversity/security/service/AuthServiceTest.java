package com.smartuniversity.security.service;

import com.smartuniversity.common.exception.BadRequestException;
import com.smartuniversity.common.exception.ResourceNotFoundException;
import com.smartuniversity.security.dto.*;
import com.smartuniversity.security.entity.Role;
import com.smartuniversity.security.entity.User;
import com.smartuniversity.security.jwt.JwtTokenProvider;
import com.smartuniversity.security.mapper.UserMapper;
import com.smartuniversity.security.repository.RoleRepository;
import com.smartuniversity.security.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private UserMapper userMapper;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthService authService;

    private User user;
    private Role studentRole;

    @BeforeEach
    void setUp() {
        studentRole = Role.builder()
                .id(1L)
                .name("STUDENT")
                .description("Student")
                .permissions(Set.of())
                .build();

        user = User.builder()
                .id(1L)
                .email("test@smart.edu")
                .password("encoded_password")
                .enabled(true)
                .accountNonLocked(true)
                .roles(Set.of(studentRole))
                .build();
    }

    @Test
    void register_shouldCreateUserAndReturnTokens() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@smart.edu");
        request.setPassword("password123");

        when(userRepository.existsByEmail("new@smart.edu")).thenReturn(false);
        when(roleRepository.findByName("STUDENT")).thenReturn(Optional.of(studentRole));
        when(passwordEncoder.encode("password123")).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(tokenProvider.generateAccessToken("test@smart.edu")).thenReturn("access-token");
        when(tokenProvider.generateRefreshToken("test@smart.edu")).thenReturn("refresh-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("access-token", response.getAccessToken());
        assertEquals("refresh-token", response.getRefreshToken());
        assertEquals("test@smart.edu", response.getEmail());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_shouldThrowWhenEmailExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@smart.edu");
        request.setPassword("password123");

        when(userRepository.existsByEmail("existing@smart.edu")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
    }

    @Test
    void login_shouldReturnTokens() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@smart.edu");
        request.setPassword("password123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(tokenProvider.generateAccessToken(authentication)).thenReturn("access-token");
        when(tokenProvider.generateRefreshToken(authentication)).thenReturn("refresh-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("access-token", response.getAccessToken());
        assertEquals("refresh-token", response.getRefreshToken());
        assertEquals("Bearer", response.getTokenType());
    }

    @Test
    void refresh_shouldReturnNewTokens() {
        RefreshTokenRequest request = new RefreshTokenRequest();
        request.setRefreshToken("valid-refresh-token");

        when(tokenProvider.validateToken("valid-refresh-token")).thenReturn(true);
        when(tokenProvider.getTokenType("valid-refresh-token")).thenReturn("refresh");
        when(tokenProvider.getEmailFromToken("valid-refresh-token")).thenReturn("test@smart.edu");
        when(tokenProvider.generateAccessToken("test@smart.edu")).thenReturn("new-access");
        when(tokenProvider.generateRefreshToken("test@smart.edu")).thenReturn("new-refresh");

        AuthResponse response = authService.refresh(request);

        assertNotNull(response);
        assertEquals("new-access", response.getAccessToken());
        assertEquals("new-refresh", response.getRefreshToken());
    }

    @Test
    void refresh_shouldThrowOnInvalidToken() {
        RefreshTokenRequest request = new RefreshTokenRequest();
        request.setRefreshToken("invalid-token");

        when(tokenProvider.validateToken("invalid-token")).thenReturn(false);

        assertThrows(BadRequestException.class, () -> authService.refresh(request));
    }
}
