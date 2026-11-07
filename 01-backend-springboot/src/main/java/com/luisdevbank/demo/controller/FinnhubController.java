package com.luisdevbank.demo.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/finnhub")
public class FinnhubController {
    private final RestClient client;
    private final String apiKey;

    public FinnhubController(@Value("${app.finnhub.api-key:}") String apiKey) {
        this.apiKey = apiKey;
        this.client = RestClient.builder().baseUrl("https://finnhub.io/api/v1").build();
    }

    @GetMapping("/quote")
    public Map<?, ?> quote(@RequestParam String symbol) {
        return get("/quote", symbol);
    }

    @GetMapping("/profile")
    public Map<?, ?> profile(@RequestParam String symbol) {
        return get("/stock/profile2", symbol);
    }

    private Map<?, ?> get(String endpoint, String symbol) {
        if (apiKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Falta configurar FINNHUB_API_KEY en el entorno del backend.");
        }
        try {
            Map<?, ?> response = client.get().uri(uri -> uri.path(endpoint)
                    .queryParam("symbol", symbol.trim().toUpperCase())
                    .queryParam("token", apiKey).build()).retrieve().body(Map.class);
            if (response == null || response.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Finnhub no devolvió información para ese símbolo.");
            }
            return response;
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "No se pudo consultar Finnhub. Verifica la API key y vuelve a intentar.");
        }
    }
}
