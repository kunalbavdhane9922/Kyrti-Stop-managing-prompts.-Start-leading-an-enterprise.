package com.saep.workforce.infrastructure.persistence;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.hibernate.Session;
import org.springframework.stereotype.Component;
import jakarta.persistence.EntityManager;

@Aspect
@Component
public class TenantFilterInterceptor {

    private final EntityManager entityManager;

    public TenantFilterInterceptor(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    /**
     * ROW-LEVEL SECURITY ENFORCEMENT
     * Intercepts every single service method call. It grabs the current Tenant ID
     * (in a real app, from the JWT Context) and forces Hibernate to append
     * 'WHERE tenant_id = ?' to every SQL query executed during this transaction.
     */
    @Before("execution(* com.saep.workforce.domain..*(..))")
    public void enableTenantFilter() {
        Session session = entityManager.unwrap(Session.class);
        
        // Simulated context extraction. In reality, this comes from SecurityContextHolder
        String currentTenantId = "tenant_xyz"; 
        
        session.enableFilter("tenantFilter").setParameter("tenantId", currentTenantId);
        System.out.println("[ORM SECURITY] Enabled Row-Level Security for tenant: " + currentTenantId);
    }
}
