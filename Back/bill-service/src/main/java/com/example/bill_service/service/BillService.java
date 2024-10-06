package com.example.bill_service.service;

import com.example.bill_service.dto.BillDTO;
import com.example.bill_service.model.Bill;
import com.example.bill_service.model.BillDetail;
import com.example.bill_service.model.Owner;
import com.example.bill_service.repository.BillRepository;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.oned.Code128Writer;
import com.google.zxing.qrcode.QRCodeWriter;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import org.modelmapper.ModelMapper;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private OwnerService ownerService;

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


    private Image generateQRCodeImage(String text, int width, int height) throws com.google.zxing.WriterException, IOException {
        com.google.zxing.qrcode.QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        byte[] pngData = pngOutputStream.toByteArray();
        return new Image(ImageDataFactory.create(pngData));
    }

    // Método para generar imagen de código de barras
    private Image generateBarcodeImage(String text, int width, int height) throws WriterException, IOException {
        Code128Writer barcodeWriter = new Code128Writer();
        BitMatrix bitMatrix = barcodeWriter.encode(text, BarcodeFormat.CODE_128, width, height);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        byte[] pngData = pngOutputStream.toByteArray();
        return new Image(ImageDataFactory.create(pngData));
    }

    public byte[] generateBillPdf(Long id) {
        Color lightGreen = new DeviceRgb(224, 255, 224);

        Bill bill = billRepository.findById(id).orElse(null);
        assert bill != null;
        Owner owner = ownerService.getOwnerById(bill.getOwnerId());

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Título principal

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM", new Locale("es", "ES"));
            String spanishMonth = bill.getCreatedDate().format(formatter);

            document.add(new Paragraph("Expensa de mes " + spanishMonth + " de " + bill.getCreatedDate().getYear()).setFontSize(15)
                    .setTextAlignment(TextAlignment.CENTER));


            // Tabla de información general con borde exterior visible
            Table containerTable = new Table(UnitValue.createPercentArray(new float[]{8, 2}));
            containerTable.setWidth(UnitValue.createPercentValue(100));
            containerTable.setBorder(new SolidBorder(1));

            // Tabla de información general sin bordes en las celdas
            Table infoTable = new Table(UnitValue.createPercentArray(new float[]{5, 5}));
            infoTable.setWidth(UnitValue.createPercentValue(100));
            infoTable.setBorder(Border.NO_BORDER);

            // Añadir información general
            infoTable.addCell(new Cell().setBorder(Border.NO_BORDER).add(new Paragraph("ADMINISTRACION:").setBold()));
            infoTable.addCell(new Cell().setBorder(Border.NO_BORDER).add(new Paragraph("PROPIETARIO").setBold()));
            infoTable.addCell(new Cell().setBorder(Border.NO_BORDER).add(new Paragraph("Nombre: Curso-2w1-2024")));
            infoTable.addCell(new Cell().setBorder(Border.NO_BORDER).add(new Paragraph("Nombre: "+owner.getName())));
            infoTable.addCell(new Cell().setBorder(Border.NO_BORDER).add(new Paragraph("Domicilio: Cordoba-Argentina")));
            infoTable.addCell(new Cell().setBorder(Border.NO_BORDER).add(new Paragraph("CUIT: " +owner.getCuit().toString())));
            infoTable.addCell(new Cell().setBorder(Border.NO_BORDER).add(new Paragraph("Mail: info@gmail.com")));
            infoTable.addCell(new Cell().setBorder(Border.NO_BORDER).add(new Paragraph("Domicilio: "+ owner.getHome())));
            infoTable.addCell(new Cell().setBorder(Border.NO_BORDER).add(new Paragraph("CUIT: 20-12345678-4")));

            // Añadir la tabla de información dentro del cuadro
            containerTable.addCell(new Cell().setBorder(Border.NO_BORDER).add(infoTable));

            // Generar código QR
            String qrContent = "https://www.mercadopago.com.ar";
            Image qrImage = generateQRCodeImage(qrContent, 100, 100);
            qrImage.setHorizontalAlignment(HorizontalAlignment.RIGHT);

            containerTable.addCell(new Cell().setBorder(Border.NO_BORDER).add(qrImage).setTextAlignment(TextAlignment.RIGHT));

            // Añadir la tabla completa al documento
            document.add(containerTable);

            // Título de Estado financiero
            document.add(new Paragraph("Estado financiero").setFontSize(12)
                    .setTextAlignment(TextAlignment.LEFT));

            // Tabla del Estado financiero
            Table financialStatusTable = new Table(UnitValue.createPercentArray(new float[]{5, 3}));
            financialStatusTable.setWidth(UnitValue.createPercentValue(100));
            financialStatusTable.setBorder(new SolidBorder(1));

            financialStatusTable.addCell(new Cell().add(new Paragraph("Saldo de Inicio del Mes Anterior")).setBorder(Border.NO_BORDER).setBorderBottom(new SolidBorder(1)).setBackgroundColor(lightGreen));
            financialStatusTable.addCell(new Cell().add(new Paragraph("$algo" )).setBorder(Border.NO_BORDER).setBorderBottom(new SolidBorder(1)).setTextAlignment(TextAlignment.RIGHT).setBackgroundColor(lightGreen));

            financialStatusTable.addCell(new Cell().add(new Paragraph("Ingresos")).setBorder(Border.NO_BORDER));
            financialStatusTable.addCell(new Cell().add(new Paragraph("$algo" )).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT));

            financialStatusTable.addCell(new Cell().add(new Paragraph("Egresos")).setBorder(Border.NO_BORDER));
            financialStatusTable.addCell(new Cell().add(new Paragraph("$algo" )).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT));

            financialStatusTable.addCell(new Cell().add(new Paragraph("Gastos del Mes")).setBorder(Border.NO_BORDER));
            financialStatusTable.addCell(new Cell().add(new Paragraph("$algo")).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT));

            financialStatusTable.addCell(new Cell().add(new Paragraph("Caja de Cierre al Mes Actual")).setBorder(Border.NO_BORDER).setBorderTop(new SolidBorder(1)).setBackgroundColor(lightGreen));
            financialStatusTable.addCell(new Cell().add(new Paragraph("$algo")).setBorder(Border.NO_BORDER).setBorderTop(new SolidBorder(1)).setTextAlignment(TextAlignment.RIGHT).setBackgroundColor(lightGreen));

            document.add(financialStatusTable);

            // Título del Detalle de Egresos
            document.add(new Paragraph("Detalle de Gastos").setFontSize(12)
                    .setTextAlignment(TextAlignment.LEFT));

            // Tabla de Detalle de Egresos
            Table expensesTable = new Table(UnitValue.createPercentArray(new float[]{5, 3, 2, 2}));
            expensesTable.setWidth(UnitValue.createPercentValue(100));
            expensesTable.setBorder(new SolidBorder(1));

            // Encabezados
            expensesTable.addCell(new Cell().setBackgroundColor(lightGreen).add(new Paragraph("Tipo de Gasto")).setBorder(Border.NO_BORDER).setBorderBottom(new SolidBorder(1)));
            expensesTable.addCell(new Cell().setBackgroundColor(lightGreen).add(new Paragraph("Descripción")).setBorder(Border.NO_BORDER).setBorderBottom(new SolidBorder(1)));
            expensesTable.addCell(new Cell().setBackgroundColor(lightGreen).add(new Paragraph("Porcentaje")).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT).setBorderBottom(new SolidBorder(1)));
            expensesTable.addCell(new Cell().setBackgroundColor(lightGreen).add(new Paragraph("Monto")).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT).setBorderBottom(new SolidBorder(1)));

            // Filas de Detalle de Gastos
            for (BillDetail detail : bill.getBillDetails()) {
                expensesTable.addCell(new Cell().add(new Paragraph(detail.getExpenseType().getDescription())).setBorder(Border.NO_BORDER));
                expensesTable.addCell(new Cell().add(new Paragraph(detail.getDescription())).setBorder(Border.NO_BORDER));
                expensesTable.addCell(new Cell().add(new Paragraph(detail.getPercentage() + "%")).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT));
                expensesTable.addCell(new Cell().add(new Paragraph("$" + detail.getAmount())).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT));
            }
            expensesTable.addCell(new Cell().add(new Paragraph("Total").setBold()).setBackgroundColor(lightGreen).setBorder(Border.NO_BORDER).setBorderTop(new SolidBorder(1)));
            expensesTable.addCell(new Cell().add(new Paragraph("")).setBackgroundColor(lightGreen).setBorder(Border.NO_BORDER).setBorderTop(new SolidBorder(1)));
            expensesTable.addCell(new Cell().add(new Paragraph("")).setBackgroundColor(lightGreen).setBorder(Border.NO_BORDER).setBorderTop(new SolidBorder(1)));
            expensesTable.addCell(new Cell().add(new Paragraph("$" + bill.getBillAmount())).setTextAlignment(TextAlignment.RIGHT).setBackgroundColor(lightGreen).setBorder(Border.NO_BORDER).setBorderTop(new SolidBorder(1)));
            document.add(expensesTable);



            // Espacio en blanco
            document.add(new Paragraph("\n"));


            // Tabla de vencimientos
            Table expirationTable = new Table(UnitValue.createPercentArray(new float[]{5,5}))
                    .setBorder(new SolidBorder(1)).setWidth(UnitValue.createPercentValue(100));

            expirationTable.addCell(new Cell(1,2).add(new Paragraph("Vencimientos").setTextAlignment(TextAlignment.CENTER)).setBackgroundColor(lightGreen));
            expirationTable.addCell(new Cell().add(new Paragraph("1er VTO").setTextAlignment(TextAlignment.CENTER).setFontSize(10)).setBorder(Border.NO_BORDER).setBorderRight(new SolidBorder(1)));
            expirationTable.addCell(new Cell().add(new Paragraph("2do VTO").setTextAlignment(TextAlignment.CENTER).setFontSize(10)).setBorder(Border.NO_BORDER).setBorderRight(new SolidBorder(1)));
            expirationTable.addCell(new Cell().add(new Paragraph(bill.getFirstExpirationDate().toString()).setTextAlignment(TextAlignment.CENTER).setBold()).setBorder(Border.NO_BORDER).setBorderRight(new SolidBorder(1)));
            expirationTable.addCell(new Cell().add(new Paragraph(bill.getSecondExpirationDate().toString()).setTextAlignment(TextAlignment.CENTER).setBold()).setBorder(Border.NO_BORDER).setBorderRight(new SolidBorder(1)));
            expirationTable.addCell(new Cell().add(new Paragraph("A PAGAR").setTextAlignment(TextAlignment.CENTER).setFontSize(10)).setBorder(Border.NO_BORDER).setBorderRight(new SolidBorder(1)));
            expirationTable.addCell(new Cell().add(new Paragraph("A PAGAR").setTextAlignment(TextAlignment.CENTER).setFontSize(10)).setBorder(Border.NO_BORDER).setBorderRight(new SolidBorder(1)));
            expirationTable.addCell(new Cell().add(new Paragraph("$"+bill.getFirstExpirationAmount()).setTextAlignment(TextAlignment.CENTER).setBold()).setBorder(Border.NO_BORDER).setBorderRight(new SolidBorder(1)));
            expirationTable.addCell(new Cell().add(new Paragraph("$"+bill.getSecondExpirationAmount()).setTextAlignment(TextAlignment.CENTER).setBold()).setBorder(Border.NO_BORDER).setBorderRight(new SolidBorder(1)));

            document.add(expirationTable);


            document.add(new Paragraph("\n"));

            // Generar códigos de barras
            String barcodeContent = "12345123451234512345123454512345";
            Image barcodeImage = generateBarcodeImage(barcodeContent, 240, 50);
            barcodeImage.setHorizontalAlignment(HorizontalAlignment.CENTER);

            String barcodeContent2 = "67895567895678956789567898956789";
            Image barcodeImage2 = generateBarcodeImage(barcodeContent2, 240, 50);
            barcodeImage2.setHorizontalAlignment(HorizontalAlignment.CENTER);

            Table barraCodeTable = new Table(UnitValue.createPercentArray(new float[]{5, 5})).setBorder(new SolidBorder(1));
            barraCodeTable.setWidth(UnitValue.createPercentValue(100));
            barraCodeTable.setTextAlignment(TextAlignment.CENTER);


            barraCodeTable.addCell(new Cell().add(new Paragraph("RapiPago"  ).setFontSize(9)).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.CENTER));
            barraCodeTable.addCell(new Cell().add(new Paragraph("PagoFacil").setFontSize(9)).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.CENTER));

            barraCodeTable.addCell(new Cell().add(barcodeImage).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.CENTER));
            barraCodeTable.addCell(new Cell().add(barcodeImage2).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.CENTER));
            barraCodeTable.addCell(new Cell().add(new Paragraph("\n")).setBorder(Border.NO_BORDER));

            document.add(barraCodeTable);


            document.close();
            return outputStream.toByteArray();

        }  catch (IOException | WriterException e) {
            e.printStackTrace();
            return null;
        }
    }

}
