package com.saep.identity.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;

@Service
public class AuditEventService {
    private static final Logger log = LoggerFactory.getLogger(AuditEventService.class);

    public enum Severity {
        INFO, WARN, SECURITY, CRITICAL
    }

    public enum EventType {
        LOGIN_SUCCESS(Severity.INFO),
        SESSION_CREATED(Severity.INFO),
        LOGIN_FAILED(Severity.WARN),
        TOTP_FAILED(Severity.WARN),
        TWO_FA_SETUP_STARTED(Severity.INFO),
        TWO_FA_ENABLED(Severity.SECURITY),
        TWO_FA_DISABLED(Severity.SECURITY),
        PASSWORD_RESET(Severity.SECURITY),
        PASSWORD_CHANGED(Severity.SECURITY),
        RECOVERY_CODE_USED(Severity.SECURITY),
        TRUSTED_DEVICE_ADDED(Severity.SECURITY),
        TRUSTED_DEVICE_REMOVED(Severity.SECURITY),
        SESSION_RISK_DETECTED(Severity.SECURITY),
        TENANT_SELECTED(Severity.INFO),
        SESSION_TERMINATED(Severity.INFO),
        LOGOUT_ALL(Severity.SECURITY),
        MULTIPLE_FAILED_LOGINS(Severity.CRITICAL),
        ACCOUNT_LOCKED(Severity.CRITICAL);

        private final Severity defaultSeverity;

        EventType(Severity defaultSeverity) {
            this.defaultSeverity = defaultSeverity;
        }

        public Severity getDefaultSeverity() {
            return defaultSeverity;
        }
    }

    public void emit(EventType type, String userId, Map<String, Object> metadata) {
        // In the future, this will publish to a Kafka topic "saep.audit.events"
        String payload = String.format("{\"timestamp\":\"%s\", \"type\":\"%s\", \"severity\":\"%s\", \"userId\":\"%s\", \"metadata\":%s}",
                Instant.now().toString(),
                type.name(),
                type.getDefaultSeverity().name(),
                userId != null ? userId : "anonymous",
                metadata != null ? metadata.toString() : "{}");
        
        switch (type.getDefaultSeverity()) {
            case INFO: log.info("AUDIT EVENT: {}", payload); break;
            case WARN: log.warn("AUDIT EVENT: {}", payload); break;
            case SECURITY: log.warn("SECURITY AUDIT EVENT: {}", payload); break;
            case CRITICAL: log.error("CRITICAL AUDIT EVENT: {}", payload); break;
        }
    }
}
