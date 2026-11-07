package com.luisdevbank.demo.service;

import com.luisdev.demo.dt.request.LoginRequest;
import com.luisdev.demo.dt.request.RegisterRequest;
import com.luisdev.demo.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);

}
