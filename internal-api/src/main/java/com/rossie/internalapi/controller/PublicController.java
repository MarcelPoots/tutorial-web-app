package com.rossie.internalapi.controller;

import com.rossie.internalapi.model.InfoResult;
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
    public ResponseEntity<InfoResult> info(){
        InfoResult infoResult = new InfoResult(new Date(), "Some public info..." );
        return new ResponseEntity<>( infoResult , HttpStatus.OK);
    }
}
