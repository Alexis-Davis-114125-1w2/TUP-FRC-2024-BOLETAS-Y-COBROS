package com.example.bill_service.model;

import lombok.Data;

@Data
public class Owner {
    private Long id;
    private String name;
    private String home ;
    private String email;
    private Integer cuit;
    private Integer phone;
    private String tax_situation;
    // Otros campos según la respuesta de la API
}