package com.luisdevbank.demo.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import com.luisdev.demo.dto.response.AccountResponse;
import com.luisdevbank.demo.service.AccountService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
@Profile("!test")
@SecurityRequirement(name = "bearerAuth")
public class AccountController {
    private final AccountService accountService;

    @GetMapping
    public ResponseEntity<List<AccountResponse>> getMyAccount(Principal principal) {
        return ResponseEntity.ok(accountService.getUserAccounts(principal.getName()));
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<AccountResponse> getAccountByNumber(
            @PathVariable String accountNumber,
            Principal principal) {
        return ResponseEntity.ok(accountService.getAccountByNumber(accountNumber, principal.getName()));
    }
}
