package com.Facturacion.facturacion.models;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class FacturaCompleta {
    
    // Datos del Emisor
    private String rucEmisor = "0503815623001";
    private String nombreEmpresa = "PICANTERIA DON MARCELO";
    private String nombrePropietario = "ESCOBAR CAJAMARCA IVETH MARICELA";
    private String direccionEmisor = "GALO PLAZA S/N Y CALLE GONZALO ALBARRACIN";
    private String direccionSucursal = "GALO PLAZA S/N Y CALLE GONZALO ALBARRACIN";
    private boolean obligadoContabilidad = false;
    
    // Datos de la Factura
    private String numeroFactura;
    private String numeroAutorizacion;
    private String fechaEmision;
    private String fechaAutorizacion;
    private String ambiente = "PRODUCCION";
    private String tipoEmision = "NORMAL";
    private String claveAcceso;
    
    // Datos del Cliente
    private String razonSocialCliente;
    private String rucCliente;
    private String direccionCliente;
    private String correoCliente;
    private String telefonoCliente;
    private String guiaRemision;
    
    // Items de la factura
    private List<ItemFactura> items = new ArrayList<>();
    
    // Forma de Pago
    private String codigoFormaPago = "01";
    private String formaPago = "SIN UTILIZACION DEL SISTEMA FINANCIERO";
    private String plazo = "";
    
    // Totales
    private double subtotal15 = 0;
    private double subtotal0 = 0;
    private double subtotalNoObjetoIva = 0;
    private double subtotalExentoIva = 0;
    private double subtotalSinImpuestos = 0;
    private double totalDescuento = 0;
    private double servicio = 0;
    private double ice = 0;
    private double iva15 = 0;
    private double valorTotal = 0;
    
    public FacturaCompleta() {
        generarDatosFactura();
    }
    
    private void generarDatosFactura() {
        // Generar número de factura automático
        long timestamp = System.currentTimeMillis();
        this.numeroFactura = "001-001-" + String.format("%09d", timestamp % 1000000000);
        
        // Generar número de autorización (49 dígitos)
        this.numeroAutorizacion = generarNumeroAutorizacion();
        this.claveAcceso = this.numeroAutorizacion;
        
        // Fecha actual
        LocalDateTime ahora = LocalDateTime.now();
        DateTimeFormatter formatoFecha = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter formatoFechaHora = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        this.fechaEmision = ahora.format(formatoFecha);
        this.fechaAutorizacion = ahora.format(formatoFechaHora);
    }
    
    private String generarNumeroAutorizacion() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 49; i++) {
            sb.append((int)(Math.random() * 10));
        }
        return sb.toString();
    }
    
    public void agregarItem(String codigo, String descripcion, int cantidad, double precioUnitario, double descuento) {
        int numero = items.size() + 1;
        ItemFactura item = new ItemFactura(numero, codigo, descripcion, cantidad, precioUnitario, descuento);
        items.add(item);
        calcularTotales();
    }
    
    public void calcularTotales() {
        this.subtotal15 = 0;
        this.totalDescuento = 0;
        
        for (ItemFactura item : items) {
            item.calcularTotal();
            this.subtotal15 += item.getTotal();
            this.totalDescuento += item.getDescuento();
        }
        
        this.subtotalSinImpuestos = this.subtotal15;
        this.iva15 = this.subtotal15 * 0.15;
        this.valorTotal = this.subtotalSinImpuestos + this.iva15 + this.ice + this.servicio;
    }
    
    public void limpiarItems() {
        this.items.clear();
        calcularTotales();
    }

    // Getters y Setters
    public String getRucEmisor() {
        return rucEmisor;
    }

    public void setRucEmisor(String rucEmisor) {
        this.rucEmisor = rucEmisor;
    }

    public String getNombreEmpresa() {
        return nombreEmpresa;
    }

    public void setNombreEmpresa(String nombreEmpresa) {
        this.nombreEmpresa = nombreEmpresa;
    }

    public String getNombrePropietario() {
        return nombrePropietario;
    }

    public void setNombrePropietario(String nombrePropietario) {
        this.nombrePropietario = nombrePropietario;
    }

    public String getDireccionEmisor() {
        return direccionEmisor;
    }

    public void setDireccionEmisor(String direccionEmisor) {
        this.direccionEmisor = direccionEmisor;
    }

    public String getDireccionSucursal() {
        return direccionSucursal;
    }

    public void setDireccionSucursal(String direccionSucursal) {
        this.direccionSucursal = direccionSucursal;
    }

    public boolean isObligadoContabilidad() {
        return obligadoContabilidad;
    }

    public void setObligadoContabilidad(boolean obligadoContabilidad) {
        this.obligadoContabilidad = obligadoContabilidad;
    }

    public String getNumeroFactura() {
        return numeroFactura;
    }

    public void setNumeroFactura(String numeroFactura) {
        this.numeroFactura = numeroFactura;
    }

    public String getNumeroAutorizacion() {
        return numeroAutorizacion;
    }

    public void setNumeroAutorizacion(String numeroAutorizacion) {
        this.numeroAutorizacion = numeroAutorizacion;
    }

    public String getFechaEmision() {
        return fechaEmision;
    }

    public void setFechaEmision(String fechaEmision) {
        this.fechaEmision = fechaEmision;
    }

    public String getFechaAutorizacion() {
        return fechaAutorizacion;
    }

    public void setFechaAutorizacion(String fechaAutorizacion) {
        this.fechaAutorizacion = fechaAutorizacion;
    }

    public String getAmbiente() {
        return ambiente;
    }

    public void setAmbiente(String ambiente) {
        this.ambiente = ambiente;
    }

    public String getTipoEmision() {
        return tipoEmision;
    }

    public void setTipoEmision(String tipoEmision) {
        this.tipoEmision = tipoEmision;
    }

    public String getClaveAcceso() {
        return claveAcceso;
    }

    public void setClaveAcceso(String claveAcceso) {
        this.claveAcceso = claveAcceso;
    }

    public String getRazonSocialCliente() {
        return razonSocialCliente;
    }

    public void setRazonSocialCliente(String razonSocialCliente) {
        this.razonSocialCliente = razonSocialCliente;
    }

    public String getRucCliente() {
        return rucCliente;
    }

    public void setRucCliente(String rucCliente) {
        this.rucCliente = rucCliente;
    }

    public String getDireccionCliente() {
        return direccionCliente;
    }

    public void setDireccionCliente(String direccionCliente) {
        this.direccionCliente = direccionCliente;
    }

    public String getCorreoCliente() {
        return correoCliente;
    }

    public void setCorreoCliente(String correoCliente) {
        this.correoCliente = correoCliente;
    }

    public String getTelefonoCliente() {
        return telefonoCliente;
    }

    public void setTelefonoCliente(String telefonoCliente) {
        this.telefonoCliente = telefonoCliente;
    }

    public String getGuiaRemision() {
        return guiaRemision;
    }

    public void setGuiaRemision(String guiaRemision) {
        this.guiaRemision = guiaRemision;
    }

    public List<ItemFactura> getItems() {
        return items;
    }

    public void setItems(List<ItemFactura> items) {
        this.items = items;
        calcularTotales();
    }

    public String getCodigoFormaPago() {
        return codigoFormaPago;
    }

    public void setCodigoFormaPago(String codigoFormaPago) {
        this.codigoFormaPago = codigoFormaPago;
    }

    public String getFormaPago() {
        return formaPago;
    }

    public void setFormaPago(String formaPago) {
        this.formaPago = formaPago;
    }

    public String getPlazo() {
        return plazo;
    }

    public void setPlazo(String plazo) {
        this.plazo = plazo;
    }

    public double getSubtotal15() {
        return subtotal15;
    }

    public void setSubtotal15(double subtotal15) {
        this.subtotal15 = subtotal15;
    }

    public double getSubtotal0() {
        return subtotal0;
    }

    public void setSubtotal0(double subtotal0) {
        this.subtotal0 = subtotal0;
    }

    public double getSubtotalNoObjetoIva() {
        return subtotalNoObjetoIva;
    }

    public void setSubtotalNoObjetoIva(double subtotalNoObjetoIva) {
        this.subtotalNoObjetoIva = subtotalNoObjetoIva;
    }

    public double getSubtotalExentoIva() {
        return subtotalExentoIva;
    }

    public void setSubtotalExentoIva(double subtotalExentoIva) {
        this.subtotalExentoIva = subtotalExentoIva;
    }

    public double getSubtotalSinImpuestos() {
        return subtotalSinImpuestos;
    }

    public void setSubtotalSinImpuestos(double subtotalSinImpuestos) {
        this.subtotalSinImpuestos = subtotalSinImpuestos;
    }

    public double getTotalDescuento() {
        return totalDescuento;
    }

    public void setTotalDescuento(double totalDescuento) {
        this.totalDescuento = totalDescuento;
    }

    public double getServicio() {
        return servicio;
    }

    public void setServicio(double servicio) {
        this.servicio = servicio;
    }

    public double getIce() {
        return ice;
    }

    public void setIce(double ice) {
        this.ice = ice;
    }

    public double getIva15() {
        return iva15;
    }

    public void setIva15(double iva15) {
        this.iva15 = iva15;
    }

    public double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(double valorTotal) {
        this.valorTotal = valorTotal;
    }
}
