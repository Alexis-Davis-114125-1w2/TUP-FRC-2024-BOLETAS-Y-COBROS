package com.example.bill_service.controller;

import com.example.bill_service.model.Owner;
import com.example.bill_service.model.BillDetail;
import com.example.bill_service.service.BillDetailService;
import com.example.bill_service.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
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
}
