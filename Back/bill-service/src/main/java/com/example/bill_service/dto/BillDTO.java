package com.example.bill_service.dto;

import com.example.bill_service.model.PaymentMethod;
import com.example.bill_service.model.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillDTO {
    private Long id;
    private Long ownerId;
    private LocalDate firstExpirationDate;
    private Double firstExpirationAmount;
    private LocalDate secondExpirationDate;
    private Double secondExpirationAmount;
    private String paymentMethod;
    private String status;
}
