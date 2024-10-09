package com.example.bill_service.service;

import com.example.bill_service.client.Owner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OwnerService {

    private static final String OWNER_API_URL = "https://my-json-server.typicode.com/405786MoroBenjamin/users-responses/users/";

    @Autowired
    private RestTemplate restTemplate;

    public Owner getOwnerById(Long id) {
        return restTemplate.getForObject(OWNER_API_URL+id, Owner.class);
    }
}