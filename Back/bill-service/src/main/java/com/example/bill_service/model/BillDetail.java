package com.example.bill_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "bill_details")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BillDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bill_id", referencedColumnName = "id")
    private Bill bill;

    @ManyToOne
    @JoinColumn(name = "expense_type_id", referencedColumnName = "id")
    private ExpenseType expenseType;

    private String description;
    private Double amount;
    private Double percentage;

    private LocalDateTime createdDate;
    private String createdUser;

    private LocalDateTime lastUpdatedDate;
    private String lastUpdatedUser;
}
