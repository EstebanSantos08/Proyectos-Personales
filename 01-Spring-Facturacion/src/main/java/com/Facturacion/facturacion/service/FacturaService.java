package com.Facturacion.facturacion.service;

import com.Facturacion.facturacion.models.Factura;
import org.springframework.stereotype.Service;

@Service
public class FacturaService {

    // Método para calcular factura con descuentos
    public void calcularFactura(Factura factura) {
        // Calcular subtotal base
        double subtotal = factura.getCantidad() * factura.getPrecioUnitario();

        // Aplicar descuento según cantidad
        double descuento = 0;
        if (factura.getCantidad() >= 8) {
            descuento = 10; // 10% de descuento para 8 o más productos
        } else if (factura.getCantidad() >= 4) {
            descuento = 5; // 5% de descuento para 4 o más productos
        }

        // Guardar el porcentaje de descuento
        factura.setDescuento(descuento);

        // Aplicar descuento al subtotal
        double montoDescuento = subtotal * (descuento / 100);
        subtotal = subtotal - montoDescuento;

        // Calcular IVA del 15%
        double iva = subtotal * 0.15;

        // Calcular total
        double total = subtotal + iva;

        // Asignar valores a la factura
        factura.setSubtotal(subtotal);
        factura.setIva(iva);
        factura.setTotal(total);
    }
}
