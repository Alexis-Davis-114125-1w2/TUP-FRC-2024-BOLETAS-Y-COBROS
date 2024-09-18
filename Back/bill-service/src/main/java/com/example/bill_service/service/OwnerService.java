package com.example.bill_service.service;

import com.example.bill_service.model.Owner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OwnerService {

    private static final String OWNER_API_URL = "https://raw.githubusercontent.com/405313-Almeida/Fake_Api_Users/main/db.json";

    @Autowired
    private RestTemplate restTemplate;

    public Owner getOwnerById(Long id) {
        return restTemplate.getForObject(OWNER_API_URL + id, Owner.class);
    }
}