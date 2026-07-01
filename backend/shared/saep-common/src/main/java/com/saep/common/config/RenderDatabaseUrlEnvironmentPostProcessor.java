package com.saep.common.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * Automatically converts raw postgres:// or postgresql:// connection strings
 * (such as those injected by Render or cloud PaaS platforms into SPRING_DATASOURCE_URL or DATABASE_URL)
 * into standard JDBC format (jdbc:postgresql://...) before HikariCP or Flyway initializes.
 */
public class RenderDatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 10;
    }

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String url = environment.getProperty("SPRING_DATASOURCE_URL");
        if (url == null || url.trim().isEmpty()) {
            url = environment.getProperty("DATABASE_URL");
        }
        if (url == null || url.trim().isEmpty()) {
            url = environment.getProperty("spring.datasource.url");
        }

        if (url != null && (url.startsWith("postgres://") || url.startsWith("postgresql://"))) {
            try {
                String cleanUrl = url.startsWith("postgres://")
                        ? "http://" + url.substring("postgres://".length())
                        : "http://" + url.substring("postgresql://".length());
                URI uri = new URI(cleanUrl);

                String host = uri.getHost();
                int port = uri.getPort() != -1 ? uri.getPort() : 5432;
                String path = uri.getPath(); // e.g. /saep_db
                String userInfo = uri.getUserInfo();

                Map<String, Object> props = new HashMap<>();
                props.put("spring.datasource.url", "jdbc:postgresql://" + host + ":" + port + (path != null ? path : "/saep_db"));

                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    props.put("spring.datasource.username", parts[0]);
                    props.put("spring.datasource.password", parts[1]);
                } else if (userInfo != null) {
                    props.put("spring.datasource.username", userInfo);
                }

                props.put("spring.datasource.driver-class-name", "org.postgresql.Driver");

                environment.getPropertySources().addFirst(new MapPropertySource("renderDatabaseUrlFix", props));
            } catch (Exception e) {
                // Fall back to existing resolution behavior if URI parsing fails
            }
        }
    }
}
