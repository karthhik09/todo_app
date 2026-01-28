# Spring Boot CORS Configuration

To allow your React frontend (running on `http://localhost:5173`) to communicate with your Spring Boot backend (running on `http://localhost:8080`), you need to configure CORS (Cross-Origin Resource Sharing).

## Option 1: Using @CrossOrigin Annotation (Simple)

Add `@CrossOrigin` annotation to your controllers:

```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class YourController {
    // Your endpoints
}
```

## Option 2: Global CORS Configuration (Recommended)

Create a configuration class in your Spring Boot project:

```java
package com.yourpackage.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## Testing

1. Start your Spring Boot backend on port 8080
2. Start your React frontend with `npm run dev` (should run on port 5173)
3. Try logging in or signing up from the React app
4. Check the browser console for any CORS errors

If you see CORS errors, make sure:
- The backend URL in `/src/services/api.js` matches your Spring Boot server
- The CORS configuration allows the frontend origin
- Both servers are running
