package com.example.bill_service.service;

import com.example.bill_service.model.Bill;
import com.example.bill_service.model.PaymentRequest;
import com.example.bill_service.model.PaymentResponse;
import com.example.bill_service.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class PaymentService {

    @Autowired
    private BillRepository billRepository;

    public PaymentResponse processPayment(PaymentRequest paymentRequest) {
        // Aquí simularíamos el envío al microservicio de Mercado Pago
        // Por ahora, solo calcularemos el monto basado en la fecha de vencimiento

        Bill bill = billRepository.findById(paymentRequest.getBillId())
                .orElseThrow(() -> new RuntimeException("Factura no encontrada"));

        LocalDate currentDate = LocalDate.now();
        double amountToPay;

        if (currentDate.isBefore(bill.getFirstExpirationDate()) || currentDate.isEqual(bill.getFirstExpirationDate())) {
            amountToPay = bill.getFirstExpirationAmount();
        } else {
            // Si está en o después de la segunda fecha de vencimiento, se aplica el monto del segundo vencimiento
            amountToPay = bill.getSecondExpirationAmount();
        }

        return new PaymentResponse(bill.getId(), amountToPay, currentDate);
    }
}