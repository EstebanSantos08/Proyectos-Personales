package com.example.calculo_polizas.DTO;

public class PolizaDTO {

    private String propietarioNombre;
    private double costoTotal;
    private String mensaje;
    private String categoriaEdad;
    private boolean exitoso;

    // Constructor vacío
    public PolizaDTO() {
    }

    // Constructor con parámetros
    public PolizaDTO(String propietarioNombre, double costoTotal) {
        this.propietarioNombre = propietarioNombre;
        this.costoTotal = costoTotal;
        this.exitoso = true;
    }

    // Getters y Setters
    public String getPropietarioNombre() {
        return propietarioNombre;
    }

    public void setPropietarioNombre(String propietarioNombre) {
        this.propietarioNombre = propietarioNombre;
    }

    public double getCostoTotal() {
        return costoTotal;
    }

    public void setCostoTotal(double costoTotal) {
        this.costoTotal = costoTotal;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getCategoriaEdad() {
        return categoriaEdad;
    }

    public void setCategoriaEdad(String categoriaEdad) {
        this.categoriaEdad = categoriaEdad;
    }

    public boolean isExitoso() {
        return exitoso;
    }

    public void setExitoso(boolean exitoso) {
        this.exitoso = exitoso;
    }
}
