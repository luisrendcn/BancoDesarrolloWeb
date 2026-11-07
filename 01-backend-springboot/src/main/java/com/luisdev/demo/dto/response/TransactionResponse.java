package com.luisdev.demo.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import luisdev.demo.entity.enums.TransactionType;

@Getter
@Builder
public class TransactionResponse {
    private Long id;
    private String sourceAccountNumber;
    private String destinationAccountNumber;
    private BigDecimal amount;
    private TransactionType transactionType;
    private String description;
    private LocalDateTime timestamp;
}
