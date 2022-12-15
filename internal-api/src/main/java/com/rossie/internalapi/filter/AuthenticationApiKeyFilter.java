package com.rossie.internalapi.filter;

import com.rossie.internalapi.authentication.ApiKeyAuthentication;
import com.rossie.internalapi.consts.Endpoints;
import com.rossie.internalapi.consts.Roles;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

@Data
@Slf4j
public class AuthenticationApiKeyFilter extends OncePerRequestFilter {

    public static final String API_KEY_HEADER = "X-API-Key";

    private Set<String> validApiKeys = new HashSet<>();

    public AuthenticationApiKeyFilter() {
      log.info("AuthenticationApiKeyFilter applied");
    }

    protected boolean validateApiKey(String apiKey) {
        Assert.notNull(apiKey, "The apiKey argument is null");
        return validApiKeys.contains(apiKey);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        if (isCallPrivateEndpoint(request)) {

            String apiKey = request.getHeader(API_KEY_HEADER);
            if (StringUtils.hasLength(apiKey) && validateApiKey(apiKey)) {
                ApiKeyAuthentication authentication = new ApiKeyAuthentication();
                authentication.setAuthenticated(true);
                authentication.setName(API_KEY_HEADER);
                authentication.setRole(Roles.X_API_ROLE);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.debug("Authenticated with api-key");
            } else {
                String unauthorizedMessage = "Failed login with API key: " + apiKey;
                logger.info(unauthorizedMessage);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, unauthorizedMessage);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    protected boolean isCallPrivateEndpoint(HttpServletRequest request) {
        return request.getServletPath().contains(Endpoints.API_V1_PRIVATE_END_POINT);
    }

}
