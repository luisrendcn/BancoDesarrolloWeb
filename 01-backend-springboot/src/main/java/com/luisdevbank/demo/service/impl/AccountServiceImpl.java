package com.luisdevbank.demo.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Profile;

import com.luisdev.demo.dto.response.AccountResponse;
import com.luisdevbank.demo.exception.ResourceNotFoundException;
import com.luisdevbank.demo.repository.AccountRepository;
import com.luisdevbank.demo.repository.UserRepository;
import com.luisdevbank.demo.service.AccountService;

import lombok.RequiredArgsConstructor;
import luisdev.demo.entity.Account;
import luisdev.demo.entity.User;

@Service
@RequiredArgsConstructor
@Profile("!test")
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    @Override
    public List<AccountResponse> getUserAccounts(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con el email: " + email));

        return accountRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AccountResponse getAccountByNumber(String accountNumber, String email) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada: " + accountNumber));

        if (!account.getUser().getEmail().equals(email)) {
            throw new ResourceNotFoundException("No tiene permisos para ver esta cuenta");
        }

        return mapToResponse(account);
    }

    private AccountResponse mapToResponse(Account account) {
        return AccountResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .balance(account.getBalance())
                .accountType(account.getAccountType())
                .build();
    }
}
