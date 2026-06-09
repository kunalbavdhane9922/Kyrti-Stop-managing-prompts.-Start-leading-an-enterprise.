package com.saep.gateway.service;

import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
public class JwtBlacklistService {

    private final ReactiveStringRedisTemplate redisTemplate;

    public JwtBlacklistService(ReactiveStringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public Mono<Boolean> isBlacklisted(String jti) {
        if (jti == null) {
            return Mono.just(false);
        }
        return redisTemplate.hasKey("blacklist:" + jti);
    }

    public Mono<Boolean> blacklistToken(String jti, long remainingExpirationMs) {
        if (jti == null) {
            return Mono.just(false);
        }
        return redisTemplate.opsForValue()
                .set("blacklist:" + jti, "revoked", Duration.ofMillis(remainingExpirationMs));
    }
}
