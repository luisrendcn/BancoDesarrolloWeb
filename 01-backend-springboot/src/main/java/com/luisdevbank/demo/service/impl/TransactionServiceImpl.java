package com.luisdevbank.demo.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.context.annotation.Profile;

import com.luisdev.demo.dto.response.TransactionResponse;
import com.luisdev.demo.dt.request.TransferRequest;
import com.luisdevbank.demo.exception.BadRequestException;
import com.luisdevbank.demo.exception.InsufficientBalanceException;
import com.luisdevbank.demo.exception.ResourceNotFoundException;
import com.luisdevbank.demo.repository.AccountRepository;
import com.luisdevbank.demo.repository.TransactionRepository;
import com.luisdevbank.demo.service.TransactionService;

import lombok.RequiredArgsConstructor;
import luisdev.demo.entity.Account;
import luisdev.demo.entity.Transaction;
import luisdev.demo.entity.enums.TransactionType;

@Service
@RequiredArgsConstructor
@Profile("!test")
public class TransactionServiceImpl implements TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Override
    @Transactional
    public TransactionResponse transfer(TransferRequest request, String currentUserEmail) {
        if (request.getSourceAccountNumber().equals(request.getDestinationAccountNumber())) {
            throw new BadRequestException(
                    "La cuenta de origen y la cuenta de destino no pueden ser la misma");
        }

        Account sourceAccount = accountRepository.findByAccountNumberForUpdate(request.getSourceAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cuenta de origen no encontrada: " + request.getSourceAccountNumber()));

        if (sourceAccount.getUser() == null
                || !sourceAccount.getUser().getEmail().equals(currentUserEmail)) {
            throw new BadRequestException("La cuenta de origen no pertenece al usuario autenticado");
        }

        Account destinationAccount = accountRepository.findByAccountNumberForUpdate(request.getDestinationAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cuenta de destino no encontrada: " + request.getDestinationAccountNumber()));

        if (sourceAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientBalanceException("Saldo insuficiente para realizar la transferencia");
        }

        sourceAccount.setBalance(sourceAccount.getBalance().subtract(request.getAmount()));
        destinationAccount.setBalance(destinationAccount.getBalance().add(request.getAmount()));
        accountRepository.save(sourceAccount);
        accountRepository.save(destinationAccount);

        Transaction transaction = Transaction.builder()
                .sourceAccount(sourceAccount)
                .destinationAccount(destinationAccount)
                .amount(request.getAmount())
                .transactionType(TransactionType.TRANSFER)
                .description(request.getDescription())
                .build();

        return toResponse(transactionRepository.save(transaction));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponse> getAccountHistory(String accountNumber, String currentUserEmail) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada: " + accountNumber));

        if (account.getUser() == null || !account.getUser().getEmail().equals(currentUserEmail)) {
            throw new BadRequestException("La cuenta no pertenece al usuario autenticado");
        }

        return transactionRepository.findAllByAccountId(account.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private TransactionResponse toResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .sourceAccountNumber(transaction.getSourceAccount().getAccountNumber())
                .destinationAccountNumber(transaction.getDestinationAccount().getAccountNumber())
                .amount(transaction.getAmount())
                .transactionType(transaction.getTransactionType())
                .description(transaction.getDescription())
                .timestamp(transaction.getTimestamp())
                .build();
    }
}
