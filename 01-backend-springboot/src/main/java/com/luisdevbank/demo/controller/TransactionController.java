package com.luisdevbank.demo.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
        import org.springframework.context.annotation.Profile;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import com.luisdev.demo.dto.response.TransactionResponse;
import com.luisdev.demo.dt.request.TransferRequest;
import com.luisdevbank.demo.repository.AccountRepository;
import com.luisdevbank.demo.repository.TransactionRepository;
import com.luisdevbank.demo.service.TransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
    @Profile("!test")
@SecurityRequirement(name = "bearerAuth")
public class TransactionController {
    private final TransactionService transactionService;

    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transfer(
            @Valid @RequestBody TransferRequest request,
            Principal principal) {
        return ResponseEntity.ok(transactionService.transfer(request, principal.getName()));
    }

    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<List<TransactionResponse>> getAccountHistory(
            @PathVariable String accountNumber,
            Principal principal) {
        return ResponseEntity.ok(transactionService.getAccountHistory(accountNumber, principal.getName()));
    }
}
