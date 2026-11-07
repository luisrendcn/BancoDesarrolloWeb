package com.luisdevbank.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.luisdev.demo.dto.response.ExchangeRateResponse;

@Component
@Profile("!test")
public class ExchangeRateClient {
    private final RestClient restClient;

    public ExchangeRateClient(
            @Value("${app.exchange-service.url:http://localhost:3000}") String serviceUrl) {
        this.restClient = RestClient.builder().baseUrl(serviceUrl).build();
    }

    public ExchangeRateResponse getRate(String base, String quote) {
        return restClient.get()
                .uri("/api/rates/{base}/{quote}", base, quote)
                .retrieve()
                .body(ExchangeRateResponse.class);
    }
}
