package com.example.bill_service.service;

import com.example.bill_service.model.BillDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;

@Service
public class BillDetailService {

    // URL base de la API
    private static final String EXPENSE_API_URL = "https://raw.githubusercontent.com/405313-Almeida/Fake_Api_Details/main/db.json";

    @Autowired
    private RestTemplate restTemplate;

    // Método para obtener los detalles filtrados por propietario y fecha
    public List<BillDetail> getExpenseDetails(Long ownerId, LocalDate date) {
        // Construimos la URL con los parámetros
        String urlWithParams = EXPENSE_API_URL + "?ownerId=" + ownerId + "&date=" + date;

        // Realizamos la solicitud a la API
        ResponseEntity<List<BillDetail>> response = restTemplate.exchange(
                urlWithParams,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<BillDetail>>() {}
        );

        return response.getBody();
    }
}
