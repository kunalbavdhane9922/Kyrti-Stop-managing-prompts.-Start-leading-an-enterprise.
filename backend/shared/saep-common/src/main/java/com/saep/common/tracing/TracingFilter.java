package com.saep.common.tracing;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
public class TracingFilter implements Filter {

    public static final String TRACE_ID = "traceId";
    public static final String CORRELATION_ID = "correlationId";
    public static final String CAUSATION_ID = "causationId";
    public static final String HEADER_TRACE_ID = "X-Trace-Id";
    public static final String HEADER_CORRELATION_ID = "X-Correlation-Id";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        if (request instanceof HttpServletRequest httpRequest) {
            String traceId = httpRequest.getHeader(HEADER_TRACE_ID);
            if (traceId == null || traceId.isBlank()) {
                traceId = UUID.randomUUID().toString();
            }

            String correlationId = httpRequest.getHeader(HEADER_CORRELATION_ID);
            // Correlation ID is not always present initially, but we generate one if absent for single-hop requests
            // It might be overwritten or specific endpoints (like Create Company) will generate a Saga Correlation ID.
            if (correlationId == null || correlationId.isBlank()) {
                correlationId = UUID.randomUUID().toString();
            }

            MDC.put(TRACE_ID, traceId);
            MDC.put(CORRELATION_ID, correlationId);
            try {
                chain.doFilter(request, response);
            } finally {
                MDC.remove(TRACE_ID);
                MDC.remove(CORRELATION_ID);
            }
        } else {
            chain.doFilter(request, response);
        }
    }
}
