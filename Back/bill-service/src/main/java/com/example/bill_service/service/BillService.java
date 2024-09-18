package com.example.bill_service.service;

import com.example.bill_service.model.Bill;
import com.example.bill_service.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillService {
    @Autowired
    private BillRepository billRepository;

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public Bill getBillById(Long id) {
        return billRepository.findById(id).orElse(null);
    }

    public Bill saveBill(Bill bill) {
        return billRepository.save(bill);
    }
}
