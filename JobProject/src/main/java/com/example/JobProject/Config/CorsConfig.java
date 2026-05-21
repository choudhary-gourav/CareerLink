package com.example.JobProject.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

/**
 * CORS configuration driven entirely by the CORS_ALLOWED_ORIGINS environment variable.
 *
 * Local dev  → set in application-local.properties (gitignored)
 * Production → set in Render dashboard as CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
 *
 * Multiple origins are comma-separated:
 *   https://careerlink.vercel.app,https://www.careerlink.vercel.app
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String[] origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toArray(String[]::new);

        registry.addMapping("/**")
                .allowedOriginPatterns(origins)   // allowedOriginPatterns supports wildcards
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .exposedHeaders("Authorization", "Content-Type")
                .allowCredentials(false)
                .maxAge(3600);  // 1-hour preflight cache
    }
}
