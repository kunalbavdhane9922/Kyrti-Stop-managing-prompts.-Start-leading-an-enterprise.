package com.saep.marketplace.contracts;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import com.saep.marketplace.service.MarketplaceWorkerService;

/**
 * Base class for Spring Cloud Contract verification.
 * 
 * Treasury and Workforce services act as producers in their respective sagas, 
 * but Marketplace is also a producer of hire requests. 
 * Consumer-driven contract testing prevents the event schema from drifting 
 * across saep-marketplace, saep-treasury, and saep-workforce.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
public abstract class BaseContractTest {

    @MockBean
    private MarketplaceWorkerService workerService;

    @BeforeEach
    public void setup() {
        // Setup mocks for RestAssuredMockMvc or Spring Cloud Contract verifier
    }
}
