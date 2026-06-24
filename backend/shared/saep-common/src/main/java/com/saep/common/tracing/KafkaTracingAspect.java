package com.saep.common.tracing;

import com.saep.common.event.EventEnvelope;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Aspect
@Component
public class KafkaTracingAspect {

    @Around("@annotation(org.springframework.kafka.annotation.KafkaListener)")
    public Object traceKafkaListener(ProceedingJoinPoint pjp) throws Throwable {
        Object[] args = pjp.getArgs();
        String previousTraceId = MDC.get(TracingFilter.TRACE_ID);
        String previousCorrelationId = MDC.get(TracingFilter.CORRELATION_ID);
        String previousCausationId = MDC.get(TracingFilter.CAUSATION_ID);
        boolean mdcSetByUs = false;

        try {
            for (Object arg : args) {
                String traceId = null;
                String correlationId = null;
                String eventIdAsCausation = null;

                if (arg instanceof EventEnvelope<?> envelope) {
                    traceId = envelope.getTraceId();
                    correlationId = envelope.getCorrelationId();
                    eventIdAsCausation = envelope.getEventId();
                } else if (arg instanceof String strArg && strArg.contains("\"eventId\"")) {
                    try {
                        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                        com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(strArg);
                        if (root.has("traceId")) traceId = root.get("traceId").asText();
                        if (root.has("correlationId")) correlationId = root.get("correlationId").asText();
                        if (root.has("eventId")) eventIdAsCausation = root.get("eventId").asText();
                    } catch (Exception e) {
                        // ignore
                    }
                }

                if (traceId != null || correlationId != null || eventIdAsCausation != null) {
                    if (traceId == null || traceId.isBlank()) {
                        traceId = UUID.randomUUID().toString();
                    }
                    if (correlationId == null || correlationId.isBlank()) {
                        correlationId = UUID.randomUUID().toString();
                    }
                    if (eventIdAsCausation != null && !eventIdAsCausation.isBlank()) {
                        MDC.put(TracingFilter.CAUSATION_ID, eventIdAsCausation);
                    }
                    MDC.put(TracingFilter.TRACE_ID, traceId);
                    MDC.put(TracingFilter.CORRELATION_ID, correlationId);
                    mdcSetByUs = true;
                    break;
                }
            }
            return pjp.proceed();
        } finally {
            if (mdcSetByUs) {
                if (previousTraceId != null) {
                    MDC.put(TracingFilter.TRACE_ID, previousTraceId);
                } else {
                    MDC.remove(TracingFilter.TRACE_ID);
                }
                
                if (previousCorrelationId != null) {
                    MDC.put(TracingFilter.CORRELATION_ID, previousCorrelationId);
                } else {
                    MDC.remove(TracingFilter.CORRELATION_ID);
                }
                
                if (previousCausationId != null) {
                    MDC.put(TracingFilter.CAUSATION_ID, previousCausationId);
                } else {
                    MDC.remove(TracingFilter.CAUSATION_ID);
                }
            }
        }
    }
}
