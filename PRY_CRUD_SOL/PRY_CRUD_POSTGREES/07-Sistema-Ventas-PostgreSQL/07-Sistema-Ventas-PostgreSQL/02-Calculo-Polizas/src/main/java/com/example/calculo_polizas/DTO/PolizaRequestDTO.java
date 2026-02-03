package com.example.calculo_polizas.DTO;

public class PolizaRequestDTO {

    private String nombre;
    private Integer edad;
    private Integer accidentes;
    private Double valor;
    private String modelo;

    // Constructor vacío
    public PolizaRequestDTO() {
    }

    // Constructor con parámetros
    public PolizaRequestDTO(String nombre, Integer edad, Integer accidentes, Double valor, String modelo) {
        this.nombre = nombre;
        this.edad = edad;
        this.accidentes = accidentes;
        this.valor = valor;
        this.modelo = modelo;
    }

    // Getters y Setters
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getEdad() {
        return edad;
    }

    public void setEdad(Integer edad) {
        this.edad = edad;
    }

    public Integer getAccidentes() {
        return accidentes;
    }

    public void setAccidentes(Integer accidentes) {
        this.accidentes = accidentes;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }
}
