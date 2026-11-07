package com.luisdevbank.demo.service;

import java.util.List;

import com.luisdev.demo.dto.response.TransactionResponse;
import com.luisdev.demo.dt.request.TransferRequest;

public interface TransactionService {
    TransactionResponse transfer(TransferRequest request, String currentUserEmail);

    List<TransactionResponse> getAccountHistory(String accountNumber, String currentUserEmail);
}
