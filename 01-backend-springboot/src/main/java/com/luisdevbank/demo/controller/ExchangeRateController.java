package com.luisdevbank.demo.controller;

import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.luisdev.demo.dto.response.ExchangeRateResponse;
import com.luisdevbank.demo.service.ExchangeRateClient;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/exchange")
@RequiredArgsConstructor
@Profile("!test")
public class ExchangeRateController {
    private final ExchangeRateClient exchangeRateClient;

    @GetMapping("/rate")
    public ResponseEntity<ExchangeRateResponse> getRate(
            @RequestParam(defaultValue = "USD") String from,
            @RequestParam(defaultValue = "COP") String to) {
        return ResponseEntity.ok(exchangeRateClient.getRate(from, to));
    }
}
