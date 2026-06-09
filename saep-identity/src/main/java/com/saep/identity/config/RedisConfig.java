package com.saep.identity.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.scripting.support.StaticScriptSource;

@Configuration
public class RedisConfig {

    @Bean
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory connectionFactory) {
        return new StringRedisTemplate(connectionFactory);
    }

    @Bean
    public RedisScript<Long> rotateRefreshTokenScript() {
        String scriptText = 
            "local userId = redis.call(\"HGET\", KEYS[1], \"userId\")\n" +
            "if userId ~= ARGV[1] then\n" +
            "    return 0\n" +
            "end\n" +
            "redis.call(\"DEL\", KEYS[1])\n" +
            "return 1\n";
        
        DefaultRedisScript<Long> redisScript = new DefaultRedisScript<>();
        redisScript.setScriptSource(new StaticScriptSource(scriptText));
        redisScript.setResultType(Long.class);
        return redisScript;
    }
}
