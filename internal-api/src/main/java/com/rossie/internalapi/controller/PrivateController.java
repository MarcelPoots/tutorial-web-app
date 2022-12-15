package com.rossie.internalapi.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
@RequestMapping("/api/private/v1")
public class PrivateController {

    /**
     * PLace this GET request in Postman: http://localhost:8081/internal-api/api/private/v1
     * with X-API_Key in security headers with key :
     *
     */
    @GetMapping("/info")
    public ResponseEntity<String> info(){
        return new ResponseEntity<>("Here is some private info: " + new Date() , HttpStatus.OK);
    }
}
