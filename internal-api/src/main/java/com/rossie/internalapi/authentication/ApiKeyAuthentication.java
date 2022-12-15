package com.rossie.internalapi.authentication;

import lombok.Data;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.util.Assert;
import java.util.Collection;
import java.util.HashSet;

@Data
@SuppressWarnings("serial")
public class ApiKeyAuthentication implements Authentication {

    private String name;
    private transient Object details;
    private transient Object principal;
    private boolean authenticated;
    private transient  Object credentials;
    private Collection<GrantedAuthority> authorities;

    public void setRole(String role) {
        Assert.notNull(role , "The role argument is null");
        if (authorities == null) {
            authorities = new HashSet<>();
        }
        authorities.add(new SimpleGrantedAuthority(role));
    }

}

