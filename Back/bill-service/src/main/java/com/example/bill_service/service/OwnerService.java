package com.example.bill_service.service;

import com.example.bill_service.model.Owner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OwnerService {

    private static final String OWNER_API_URL = "https://apimocha.com/eugefifa/owner";

    @Autowired
    private RestTemplate restTemplate;

    public Owner getOwnerById(Long id) {
        return restTemplate.getForObject(OWNER_API_URL, Owner.class);
    }
}