package com.curso.backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration(proxyBeanMethods = false)
@Profile("!test")
@EnableJpaRepositories(basePackages = "com.luisdevbank.demo.repository")
public class JpaRepositoryConfiguration {
}