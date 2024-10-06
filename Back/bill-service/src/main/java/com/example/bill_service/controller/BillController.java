package com.example.bill_service.controller;

import com.example.bill_service.dto.BillDTO;
import com.example.bill_service.model.*;
import com.example.bill_service.service.BillDetailService;
import com.example.bill_service.service.BillService;
import com.example.bill_service.service.OwnerService;
import com.example.bill_service.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class BillController {

    @Autowired
    private OwnerService ownerService;

    @Autowired
    private BillDetailService billDetailService;

    @Autowired
    private BillService billService;

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/bill")
    public ResponseEntity<Bill> createBill(@RequestBody Bill bill) {
        return ResponseEntity.ok(billService.saveBill(bill));
    }

    @GetMapping("/bills")
    public ResponseEntity<List<BillDTO>> getAllBills() {
        List<BillDTO> billDTOs = billService.getAllBills();
        return ResponseEntity.ok(billDTOs);
    }


    // Endpoint para obtener información del propietario por ID
    @GetMapping("/owner/{id}")
    public ResponseEntity<Owner> getOwnerById(@PathVariable Long id) {
        Owner owner = ownerService.getOwnerById(id);
        if (owner != null) {
            return ResponseEntity.ok(owner);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint para obtener detalles de las expensas filtrados por ownerId y fecha
    @GetMapping("/expenses")
    public ResponseEntity<List<BillDetail>> getExpenseDetails(
            @RequestParam Long ownerId,
            @RequestParam String date // Fecha en formato string (yyyy-MM-dd)
    ) {
        // Convertimos el string de la fecha a LocalDate
        LocalDate parsedDate = LocalDate.parse(date);

        List<BillDetail> expenses = billDetailService.getExpenseDetails(ownerId, parsedDate);
        if (expenses != null && !expenses.isEmpty()) {
            return ResponseEntity.ok(expenses);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint para procesar el pago.
    @PostMapping("/process-payment")
    public ResponseEntity<PaymentResponse> processPayment(@RequestBody PaymentRequest paymentRequest) {
        PaymentResponse response = paymentService.processPayment(paymentRequest);
        return ResponseEntity.ok(response);
    }


    // Endpoint para ver la boleta en formato pdf
    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/bill/pdf/{id}")
    public ResponseEntity<byte[]> generateBillPdf(@PathVariable Long id){

        byte[] pdfBytes = billService.generateBillPdf(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);

    }


}
