package com.example.bill_service.client;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class Owner {
    private int id;
    private String name;
    private String lastname;
    private String username;
    private String email;
    private long dni;
    private int contactId;
    private boolean active;
    private String avatarUrl;
    private LocalDate dateOfBirth;
    private List<String> roles;
    // Otros campos según la respuesta de la API
}