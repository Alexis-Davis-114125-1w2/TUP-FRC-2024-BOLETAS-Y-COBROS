package com.example.bill_service.model;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long billId;
    // Puedes agregar más campos si es necesario, como el método de pago, etc.
}
