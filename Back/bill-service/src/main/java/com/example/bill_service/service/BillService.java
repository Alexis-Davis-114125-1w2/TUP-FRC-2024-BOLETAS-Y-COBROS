package com.example.bill_service.service;

import com.example.bill_service.dto.BillDTO;
import com.example.bill_service.model.Bill;
import com.example.bill_service.repository.BillRepository;

import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<BillDTO> getAllBills() {
        List<Bill> bills = billRepository.findAll();
        List<BillDTO> billsdto = new ArrayList<>();
        bills.forEach(bill -> billsdto.add(modelMapper.map(bill, BillDTO.class)));
        return billsdto;
    }
    public Bill getBillById(Long id) {
        return billRepository.findById(id).orElse(null);
    }

    public Bill saveBill(Bill bill) {
        return billRepository.save(bill);
    }

    public byte[] generateBillPdf(){

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            // Leer el archivo html de la ruta en la que se encuentra
            File htmlFile = new File("C:/Users/User/Desktop/TPI-GRUPO/TUP-FRC-2024-BOLETAS-Y-COBROS/Back/bill-service/pdf/Bill.html");

            // Crear el documento PDF
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);

            // Convertir el HTML a PDF
            HtmlConverter.convertToPdf(new FileInputStream(htmlFile), pdf);

            pdf.close();

            return outputStream.toByteArray();

        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
