package com.rossie.internalapi.configuration;

import com.rossie.internalapi.consts.Roles;
import com.rossie.internalapi.filter.AuthenticationApiKeyFilter;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.filter.OncePerRequestFilter;

import java.util.Arrays;
import java.util.HashSet;

@Configuration
@EnableWebSecurity
public class WebSecurity {


    @Value("${security.api-keys}")
    private String[] validApiKeys;

    @Bean
    OncePerRequestFilter privateEndpointApiKeyFilter() {
        AuthenticationApiKeyFilter authenticationApiKeyFilter =
                new AuthenticationApiKeyFilter();
        authenticationApiKeyFilter.setValidApiKeys(new HashSet<>(Arrays.asList(validApiKeys)));
        return authenticationApiKeyFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.exceptionHandling();
        http.csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        http.addFilterBefore(privateEndpointApiKeyFilter(), BasicAuthenticationFilter.class);
        http.authorizeHttpRequests((authz) -> authz
                .requestMatchers("/api/private/**").authenticated()
                .requestMatchers("/api/public/**").permitAll()
            )
            .httpBasic(Customizer.withDefaults());
        return http.build();
    }

}
