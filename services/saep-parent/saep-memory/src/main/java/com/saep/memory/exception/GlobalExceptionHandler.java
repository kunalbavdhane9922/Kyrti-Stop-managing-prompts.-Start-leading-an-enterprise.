package com.saep.memory.exception;

import lombok.Builder;
import lombok.Data;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @Data
    @Builder
    public static class ErrorResponse {
        private String timestamp;
        private int status;
        private String error;
        private String errorCode;
        private String traceId;
        private String correlationId;
        private String path;
    }

    @ExceptionHandler(MemoryNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(MemoryNotFoundException ex, WebRequest request) {
        return buildResponse(ex, HttpStatus.NOT_FOUND, request.getDescription(false));
    }

    @ExceptionHandler(UnauthorizedMemoryAccessException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedMemoryAccessException ex, WebRequest request) {
        return buildResponse(ex, HttpStatus.FORBIDDEN, request.getDescription(false));
    }

    @ExceptionHandler(MemoryException.class)
    public ResponseEntity<ErrorResponse> handleGenericMemoryException(MemoryException ex, WebRequest request) {
        return buildResponse(ex, HttpStatus.BAD_REQUEST, request.getDescription(false));
    }

    private ResponseEntity<ErrorResponse> buildResponse(MemoryException ex, HttpStatus status, String path) {
        ErrorResponse response = ErrorResponse.builder()
                .timestamp(LocalDateTime.now().toString())
                .status(status.value())
                .error(ex.getMessage())
                .errorCode(ex.getErrorCode())
                .traceId(MDC.get("traceId"))
                .correlationId(MDC.get("correlationId"))
                .path(path.replace("uri=", ""))
                .build();
        return new ResponseEntity<>(response, status);
    }
}
