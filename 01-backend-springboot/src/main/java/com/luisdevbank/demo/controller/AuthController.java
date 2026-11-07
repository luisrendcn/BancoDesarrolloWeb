package com.luisdevbank.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
        import org.springframework.context.annotation.Profile;

import com.luisdev.demo.dt.request.LoginRequest;
import com.luisdev.demo.dt.request.RegisterRequest;
import com.luisdev.demo.dto.response.AuthResponse;
import com.luisdevbank.demo.repository.AccountRepository;
import com.luisdevbank.demo.repository.UserRepository;
import com.luisdevbank.demo.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
    @Profile("!test")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}