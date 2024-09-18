package com.example.bill_service.model;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PaymentResponse {
    private Long billId;
    private double amountToPay;
    private LocalDate paymentDate;

    public PaymentResponse(Long billId, double amountToPay, LocalDate paymentDate) {
        this.billId = billId;
        this.amountToPay = amountToPay;
        this.paymentDate = paymentDate;
    }
}