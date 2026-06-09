package com.saep.gateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import reactor.core.publisher.Mono;

@Configuration
public class RateLimiterConfig {

    @Bean
    public KeyResolver hybridKeyResolver() {
        return exchange -> {
            String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                // Return User ID logic here would require parsing JWT.
                // For simplicity in the KeyResolver, we can just use the token itself as the rate limit key 
                // for authenticated users, which effectively limits by user session.
                return Mono.just(authHeader.substring(7));
            }
            
            // Anonymous fallback: IP Address
            String ip = exchange.getRequest().getRemoteAddress() != null 
                    ? exchange.getRequest().getRemoteAddress().getAddress().getHostAddress() 
                    : "unknown";
            return Mono.just(ip);
        };
    }
}
