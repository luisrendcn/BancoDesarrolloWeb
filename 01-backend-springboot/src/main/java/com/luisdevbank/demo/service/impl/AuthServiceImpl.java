package com.luisdevbank.demo.service.impl;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.context.annotation.Profile;
import org.springframework.beans.factory.annotation.Value;

import com.luisdev.demo.dt.request.LoginRequest;
import com.luisdev.demo.dt.request.RegisterRequest;
import com.luisdev.demo.dto.response.AuthResponse;
import com.luisdevbank.demo.repository.AccountRepository;
import com.luisdevbank.demo.repository.UserRepository;
import com.luisdev.demo.security.JwtTokenProvider;
import com.luisdevbank.demo.service.AuthService;

import lombok.RequiredArgsConstructor;
import luisdev.demo.entity.Account;
import luisdev.demo.entity.User;
import luisdev.demo.entity.enums.AccountType;
import luisdev.demo.entity.enums.Role;

@Service
@RequiredArgsConstructor
@Profile("!test")
public class AuthServiceImpl implements AuthService {

    private static final String ACCOUNT_NUMBER_PREFIX = "003";

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${app.account.initial-balance:1000.00}")
    private BigDecimal initialAccountBalance;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("User with email " + request.getEmail() + " already exists");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        User savedUser = userRepository.save(user);

        Account initialAccount = Account.builder()
            .accountNumber(generateAccountNumber())
            .balance(initialAccountBalance)
            .accountType(AccountType.CHECKING)
            .user(savedUser)
            .build();
        accountRepository.save(initialAccount);

        return buildAuthResponse(savedUser);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        return AuthResponse.builder()
                .token(jwtTokenProvider.generateToken(user))
                .tokenType("Bearer")
                .role(user.getRole().name())
            .email(user.getEmail())
                .build();
    }

    private String generateAccountNumber() {
        String accountNumber;
        do {
            int randomNumber = java.util.concurrent.ThreadLocalRandom.current().nextInt(100_000, 1_000_000);
            accountNumber = ACCOUNT_NUMBER_PREFIX + randomNumber;
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }
}
