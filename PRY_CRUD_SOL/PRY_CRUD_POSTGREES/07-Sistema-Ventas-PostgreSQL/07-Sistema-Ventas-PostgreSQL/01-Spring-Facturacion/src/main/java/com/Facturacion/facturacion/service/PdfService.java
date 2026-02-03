package com.Facturacion.facturacion.service;

import com.Facturacion.facturacion.models.FacturaCompleta;
import com.Facturacion.facturacion.models.ItemFactura;
import com.itextpdf.barcodes.BarcodeInter25;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    private static final DeviceRgb AZUL_OSCURO = new DeviceRgb(0, 51, 102);
    private static final DeviceRgb AZUL_CLARO = new DeviceRgb(200, 220, 240);
    private static final DeviceRgb ROJO = new DeviceRgb(255, 0, 0);

    public byte[] generarFacturaPdf(FacturaCompleta factura) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf, PageSize.A4);
        document.setMargins(20, 20, 20, 20);

        PdfFont fontBold = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
        PdfFont fontNormal = PdfFontFactory.createFont(StandardFonts.HELVETICA);

        // Tabla principal con 2 columnas (Logo/Emisor | Datos Factura)
        Table headerTable = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
                .setWidth(UnitValue.createPercentValue(100));

        // COLUMNA IZQUIERDA - Logo y datos del emisor
        Cell leftCell = new Cell()
                .setBorder(Border.NO_BORDER)
                .setPadding(5);

        // Logo placeholder (círculo con texto)
        Paragraph logoText = new Paragraph("PICANTERÍA\nD'MARCELO")
                .setFont(fontBold)
                .setFontSize(16)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(AZUL_OSCURO)
                .setMarginBottom(10);
        leftCell.add(logoText);

        // Cuadro de datos del emisor
        Table emisorTable = new Table(1).setWidth(UnitValue.createPercentValue(100));
        emisorTable.setBorder(new SolidBorder(AZUL_OSCURO, 1));

        Cell emisorCell = new Cell().setBorder(Border.NO_BORDER).setPadding(8);
        emisorCell.add(new Paragraph(factura.getNombrePropietario())
                .setFont(fontBold).setFontSize(10).setFontColor(AZUL_OSCURO));
        emisorCell.add(new Paragraph(factura.getNombreEmpresa())
                .setFont(fontNormal).setFontSize(9));
        emisorCell.add(new Paragraph("DIRECCIÓN: " + factura.getDireccionEmisor())
                .setFont(fontNormal).setFontSize(8));
        emisorCell.add(new Paragraph("DIR. SUCURSAL: " + factura.getDireccionSucursal())
                .setFont(fontNormal).setFontSize(8));
        emisorCell.add(new Paragraph("OBLIGADO A LLEVAR CONTABILIDAD: " + (factura.isObligadoContabilidad() ? "SI" : "NO"))
                .setFont(fontNormal).setFontSize(8));

        emisorTable.addCell(emisorCell);
        leftCell.add(emisorTable);
        headerTable.addCell(leftCell);

        // COLUMNA DERECHA - Datos de la factura
        Cell rightCell = new Cell()
                .setBorder(new SolidBorder(AZUL_OSCURO, 1))
                .setPadding(10);

        rightCell.add(new Paragraph("R.U.C.: " + factura.getRucEmisor())
                .setFont(fontNormal).setFontSize(10));
        rightCell.add(new Paragraph("F A C T U R A")
                .setFont(fontBold).setFontSize(14).setTextAlignment(TextAlignment.CENTER));
        rightCell.add(new Paragraph("No: " + factura.getNumeroFactura())
                .setFont(fontBold).setFontSize(10).setFontColor(ROJO));
        rightCell.add(new Paragraph("NÚMERO DE AUTORIZACIÓN:")
                .setFont(fontBold).setFontSize(8).setMarginTop(5));
        rightCell.add(new Paragraph(factura.getNumeroAutorizacion())
                .setFont(fontNormal).setFontSize(7));
        rightCell.add(new Paragraph("FECHA Y HORA DE AUTORIZACIÓN:")
                .setFont(fontBold).setFontSize(8).setMarginTop(5));
        rightCell.add(new Paragraph(factura.getFechaAutorizacion())
                .setFont(fontNormal).setFontSize(8));
        rightCell.add(new Paragraph("AMBIENTE: " + factura.getAmbiente())
                .setFont(fontNormal).setFontSize(8).setMarginTop(5));
        rightCell.add(new Paragraph("EMISION: " + factura.getTipoEmision())
                .setFont(fontNormal).setFontSize(8));
        rightCell.add(new Paragraph("CLAVE DE ACCESO:")
                .setFont(fontBold).setFontSize(8).setMarginTop(5));

        // Código de barras
        BarcodeInter25 barcode = new BarcodeInter25(pdf);
        barcode.setCode(factura.getClaveAcceso().substring(0, 20)); // Usar parte de la clave
        barcode.setBarHeight(30);
        Image barcodeImage = new Image(barcode.createFormXObject(pdf));
        barcodeImage.setWidth(200);
        rightCell.add(barcodeImage);

        rightCell.add(new Paragraph(factura.getClaveAcceso())
                .setFont(fontNormal).setFontSize(6));

        headerTable.addCell(rightCell);
        document.add(headerTable);

        document.add(new Paragraph("\n").setFontSize(5));

        // DATOS DEL CLIENTE
        Table clienteTable = new Table(UnitValue.createPercentArray(new float[]{25, 35, 25, 15}))
                .setWidth(UnitValue.createPercentValue(100))
                .setBorder(new SolidBorder(AZUL_OSCURO, 1));

        // Fila 1
        addClienteCell(clienteTable, "RAZON SOCIAL:", factura.getRazonSocialCliente(), fontBold, fontNormal);
        addClienteCell(clienteTable, "FECHA DE EMISION:", factura.getFechaEmision(), fontBold, fontNormal);

        // Fila 2
        addClienteCell(clienteTable, "RUC / CI:", factura.getRucCliente(), fontBold, fontNormal);
        addClienteCell(clienteTable, "GUIA DE REMISION:", factura.getGuiaRemision() != null ? factura.getGuiaRemision() : "", fontBold, fontNormal);

        // Fila 3
        Cell direccionLabelCell = new Cell().setBorder(Border.NO_BORDER).setPadding(3);
        direccionLabelCell.add(new Paragraph("DIRECCION:").setFont(fontBold).setFontSize(8));
        clienteTable.addCell(direccionLabelCell);

        Cell direccionValueCell = new Cell(1, 3).setBorder(Border.NO_BORDER).setPadding(3);
        direccionValueCell.add(new Paragraph(factura.getDireccionCliente() != null ? factura.getDireccionCliente() : "")
                .setFont(fontNormal).setFontSize(8));
        clienteTable.addCell(direccionValueCell);

        document.add(clienteTable);

        document.add(new Paragraph("\n").setFontSize(5));

        // TABLA DE ITEMS
        Table itemsTable = new Table(UnitValue.createPercentArray(new float[]{5, 10, 40, 12, 12, 10, 11}))
                .setWidth(UnitValue.createPercentValue(100));

        // Encabezados
        String[] headers = {"No.", "CODIGO", "DESCRIPCION", "CANTIDAD", "PRECIO U.", "DESC.", "TOTAL"};
        for (String header : headers) {
            Cell headerCell = new Cell()
                    .setBackgroundColor(AZUL_OSCURO)
                    .setBorder(new SolidBorder(AZUL_OSCURO, 1))
                    .setPadding(5);
            headerCell.add(new Paragraph(header)
                    .setFont(fontBold)
                    .setFontSize(8)
                    .setFontColor(ColorConstants.WHITE)
                    .setTextAlignment(TextAlignment.CENTER));
            itemsTable.addHeaderCell(headerCell);
        }

        // Filas de items
        for (ItemFactura item : factura.getItems()) {
            addItemCell(itemsTable, String.valueOf(item.getNumero()), fontNormal, TextAlignment.CENTER);
            addItemCell(itemsTable, item.getCodigo(), fontNormal, TextAlignment.CENTER);
            addItemCell(itemsTable, item.getDescripcion(), fontNormal, TextAlignment.LEFT);
            addItemCell(itemsTable, String.valueOf(item.getCantidad()), fontNormal, TextAlignment.CENTER);
            addItemCell(itemsTable, String.format("%.2f", item.getPrecioUnitario()), fontNormal, TextAlignment.RIGHT);
            addItemCell(itemsTable, String.format("%.0f", item.getDescuento()), fontNormal, TextAlignment.CENTER);
            addItemCell(itemsTable, String.format("%.2f", item.getTotal()), fontNormal, TextAlignment.RIGHT);
        }

        document.add(itemsTable);

        document.add(new Paragraph("\n").setFontSize(5));

        // SECCIÓN INFERIOR (Info adicional + Totales)
        Table bottomTable = new Table(UnitValue.createPercentArray(new float[]{55, 45}))
                .setWidth(UnitValue.createPercentValue(100));

        // COLUMNA IZQUIERDA - Info adicional y forma de pago
        Cell leftBottomCell = new Cell().setBorder(Border.NO_BORDER).setPadding(0);

        // Info adicional
        Table infoTable = new Table(UnitValue.createPercentArray(new float[]{30, 70}))
                .setWidth(UnitValue.createPercentValue(100))
                .setBorder(new SolidBorder(AZUL_OSCURO, 1));

        Cell infoHeaderCell = new Cell(1, 2)
                .setBackgroundColor(AZUL_OSCURO)
                .setBorder(Border.NO_BORDER)
                .setPadding(5);
        infoHeaderCell.add(new Paragraph("INFORMACIÓN ADICIONAL")
                .setFont(fontBold).setFontSize(9).setFontColor(ColorConstants.WHITE));
        infoTable.addCell(infoHeaderCell);

        addInfoRow(infoTable, "CORREO:", factura.getCorreoCliente(), fontBold, fontNormal);
        addInfoRow(infoTable, "TELÉFONO:", factura.getTelefonoCliente(), fontBold, fontNormal);

        leftBottomCell.add(infoTable);

        // Forma de pago
        Table pagoTable = new Table(UnitValue.createPercentArray(new float[]{10, 55, 20, 15}))
                .setWidth(UnitValue.createPercentValue(100))
                .setBorder(new SolidBorder(AZUL_OSCURO, 1))
                .setMarginTop(10);

        // Header forma de pago
        Cell pagoHeader1 = new Cell().setBackgroundColor(AZUL_OSCURO).setBorder(Border.NO_BORDER).setPadding(3);
        pagoHeader1.add(new Paragraph("COD").setFont(fontBold).setFontSize(7).setFontColor(ColorConstants.WHITE));
        pagoTable.addHeaderCell(pagoHeader1);

        Cell pagoHeader2 = new Cell().setBackgroundColor(AZUL_OSCURO).setBorder(Border.NO_BORDER).setPadding(3);
        pagoHeader2.add(new Paragraph("FORMA DE PAGO").setFont(fontBold).setFontSize(7).setFontColor(ColorConstants.WHITE));
        pagoTable.addHeaderCell(pagoHeader2);

        Cell pagoHeader3 = new Cell().setBackgroundColor(AZUL_OSCURO).setBorder(Border.NO_BORDER).setPadding(3);
        pagoHeader3.add(new Paragraph("VALOR").setFont(fontBold).setFontSize(7).setFontColor(ColorConstants.WHITE));
        pagoTable.addHeaderCell(pagoHeader3);

        Cell pagoHeader4 = new Cell().setBackgroundColor(AZUL_OSCURO).setBorder(Border.NO_BORDER).setPadding(3);
        pagoHeader4.add(new Paragraph("PLAZO").setFont(fontBold).setFontSize(7).setFontColor(ColorConstants.WHITE));
        pagoTable.addHeaderCell(pagoHeader4);

        // Datos forma de pago
        addPagoCell(pagoTable, factura.getCodigoFormaPago(), fontNormal);
        addPagoCell(pagoTable, factura.getFormaPago(), fontNormal);
        addPagoCell(pagoTable, String.format("%.2f", factura.getValorTotal()), fontNormal);
        addPagoCell(pagoTable, factura.getPlazo(), fontNormal);

        leftBottomCell.add(pagoTable);
        bottomTable.addCell(leftBottomCell);

        // COLUMNA DERECHA - Totales
        Cell rightBottomCell = new Cell().setBorder(Border.NO_BORDER).setPadding(0);

        Table totalesTable = new Table(UnitValue.createPercentArray(new float[]{70, 30}))
                .setWidth(UnitValue.createPercentValue(100))
                .setBorder(new SolidBorder(AZUL_OSCURO, 1));

        addTotalRow(totalesTable, "SUBTOTAL 15%", factura.getSubtotal15(), fontBold, fontNormal);
        addTotalRow(totalesTable, "SUBTOTAL 0%", factura.getSubtotal0(), fontBold, fontNormal);
        addTotalRow(totalesTable, "SUBTOTAL NO OBJETO DE IVA", factura.getSubtotalNoObjetoIva(), fontBold, fontNormal);
        addTotalRow(totalesTable, "SUBTOTAL EXENTO DE IVA", factura.getSubtotalExentoIva(), fontBold, fontNormal);
        addTotalRow(totalesTable, "SUBTOTAL SIN IMPUESTOS", factura.getSubtotalSinImpuestos(), fontBold, fontNormal);
        addTotalRow(totalesTable, "TOTAL DESCUENTO", factura.getTotalDescuento(), fontBold, fontNormal);
        addTotalRow(totalesTable, "SERVICIO", factura.getServicio(), fontBold, fontNormal);
        addTotalRow(totalesTable, "ICE", factura.getIce(), fontBold, fontNormal);
        addTotalRow(totalesTable, "IVA 15%", factura.getIva15(), fontBold, fontNormal);

        // Valor Total con fondo
        Cell totalLabelCell = new Cell()
                .setBackgroundColor(AZUL_CLARO)
                .setBorder(new SolidBorder(AZUL_OSCURO, 0.5f))
                .setPadding(5);
        totalLabelCell.add(new Paragraph("VALOR TOTAL").setFont(fontBold).setFontSize(9));
        totalesTable.addCell(totalLabelCell);

        Cell totalValueCell = new Cell()
                .setBackgroundColor(AZUL_CLARO)
                .setBorder(new SolidBorder(AZUL_OSCURO, 0.5f))
                .setPadding(5);
        totalValueCell.add(new Paragraph(String.format("%.2f", factura.getValorTotal()))
                .setFont(fontBold).setFontSize(9).setTextAlignment(TextAlignment.RIGHT));
        totalesTable.addCell(totalValueCell);

        rightBottomCell.add(totalesTable);
        bottomTable.addCell(rightBottomCell);

        document.add(bottomTable);

        document.close();
        return baos.toByteArray();
    }

    private void addClienteCell(Table table, String label, String value, PdfFont fontBold, PdfFont fontNormal) {
        Cell labelCell = new Cell().setBorder(Border.NO_BORDER).setPadding(3);
        labelCell.add(new Paragraph(label).setFont(fontBold).setFontSize(8));
        table.addCell(labelCell);

        Cell valueCell = new Cell().setBorder(Border.NO_BORDER).setPadding(3);
        valueCell.add(new Paragraph(value != null ? value : "").setFont(fontNormal).setFontSize(8));
        table.addCell(valueCell);
    }

    private void addItemCell(Table table, String text, PdfFont font, TextAlignment alignment) {
        Cell cell = new Cell()
                .setBorder(new SolidBorder(ColorConstants.GRAY, 0.5f))
                .setPadding(4);
        cell.add(new Paragraph(text).setFont(font).setFontSize(8).setTextAlignment(alignment));
        table.addCell(cell);
    }

    private void addInfoRow(Table table, String label, String value, PdfFont fontBold, PdfFont fontNormal) {
        Cell labelCell = new Cell().setBorder(Border.NO_BORDER).setPadding(3);
        labelCell.add(new Paragraph(label).setFont(fontBold).setFontSize(8));
        table.addCell(labelCell);

        Cell valueCell = new Cell().setBorder(Border.NO_BORDER).setPadding(3);
        valueCell.add(new Paragraph(value != null ? value : "").setFont(fontNormal).setFontSize(8));
        table.addCell(valueCell);
    }

    private void addPagoCell(Table table, String text, PdfFont font) {
        Cell cell = new Cell().setBorder(Border.NO_BORDER).setPadding(3);
        cell.add(new Paragraph(text != null ? text : "").setFont(font).setFontSize(7));
        table.addCell(cell);
    }

    private void addTotalRow(Table table, String label, double value, PdfFont fontBold, PdfFont fontNormal) {
        Cell labelCell = new Cell()
                .setBorder(new SolidBorder(AZUL_OSCURO, 0.5f))
                .setPadding(4);
        labelCell.add(new Paragraph(label).setFont(fontBold).setFontSize(8));
        table.addCell(labelCell);

        Cell valueCell = new Cell()
                .setBorder(new SolidBorder(AZUL_OSCURO, 0.5f))
                .setPadding(4);
        valueCell.add(new Paragraph(String.format("%.2f", value))
                .setFont(fontNormal).setFontSize(8).setTextAlignment(TextAlignment.RIGHT));
        table.addCell(valueCell);
    }
}
