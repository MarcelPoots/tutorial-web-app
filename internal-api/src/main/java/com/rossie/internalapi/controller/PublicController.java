package com.rossie.internalapi.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
@RequestMapping("/api/public/v1")
public class PublicController {

    @GetMapping("/info")
    public ResponseEntity<String> info(){
        return new ResponseEntity<>("Here is some public info: " + new Date() , HttpStatus.OK);
    }
}
