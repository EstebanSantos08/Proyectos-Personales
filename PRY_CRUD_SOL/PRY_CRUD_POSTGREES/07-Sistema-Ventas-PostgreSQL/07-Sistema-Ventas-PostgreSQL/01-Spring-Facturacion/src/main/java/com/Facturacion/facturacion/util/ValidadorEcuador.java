package com.Facturacion.facturacion.util;

import org.springframework.stereotype.Component;

@Component
public class ValidadorEcuador {

    /**
     * Valida una cédula ecuatoriana (10 dígitos)
     */
    public boolean validarCedula(String cedula) {
        if (cedula == null || cedula.length() != 10) {
            return false;
        }

        // Verificar que solo contenga números
        if (!cedula.matches("\\d{10}")) {
            return false;
        }

        // Obtener los dos primeros dígitos (código de provincia)
        int provincia = Integer.parseInt(cedula.substring(0, 2));

        // Validar código de provincia (01-24 o 30 para extranjeros)
        if (provincia < 1 || (provincia > 24 && provincia != 30)) {
            return false;
        }

        // Validar tercer dígito (debe ser menor a 6 para personas naturales)
        int tercerDigito = Integer.parseInt(cedula.substring(2, 3));
        if (tercerDigito > 5) {
            return false;
        }

        // Algoritmo de validación Módulo 10
        int[] coeficientes = {2, 1, 2, 1, 2, 1, 2, 1, 2};
        int suma = 0;

        for (int i = 0; i < 9; i++) {
            int digito = Integer.parseInt(cedula.substring(i, i + 1));
            int resultado = digito * coeficientes[i];
            if (resultado > 9) {
                resultado -= 9;
            }
            suma += resultado;
        }

        int residuo = suma % 10;
        int digitoVerificador = (residuo == 0) ? 0 : (10 - residuo);
        int ultimoDigito = Integer.parseInt(cedula.substring(9, 10));

        return digitoVerificador == ultimoDigito;
    }

    /**
     * Valida un RUC ecuatoriano (13 dígitos)
     */
    public boolean validarRuc(String ruc) {
        if (ruc == null || ruc.length() != 13) {
            return false;
        }

        // Verificar que solo contenga números
        if (!ruc.matches("\\d{13}")) {
            return false;
        }

        // Los últimos 3 dígitos deben ser 001 para establecimientos
        String establecimiento = ruc.substring(10, 13);
        if (!establecimiento.equals("001")) {
            // Permitir otros establecimientos válidos (001-999)
            int numEstablecimiento = Integer.parseInt(establecimiento);
            if (numEstablecimiento < 1) {
                return false;
            }
        }

        // Obtener el tercer dígito para determinar el tipo
        int tercerDigito = Integer.parseInt(ruc.substring(2, 3));

        // Los primeros 10 dígitos corresponden a una cédula válida para personas naturales
        if (tercerDigito < 6) {
            return validarCedula(ruc.substring(0, 10));
        }

        // RUC de sociedades privadas (tercer dígito = 9)
        if (tercerDigito == 9) {
            return validarRucSociedadPrivada(ruc);
        }

        // RUC de sociedades públicas (tercer dígito = 6)
        if (tercerDigito == 6) {
            return validarRucSociedadPublica(ruc);
        }

        return false;
    }

    /**
     * Valida RUC de sociedad privada (Módulo 11)
     */
    private boolean validarRucSociedadPrivada(String ruc) {
        int[] coeficientes = {4, 3, 2, 7, 6, 5, 4, 3, 2};
        int suma = 0;

        for (int i = 0; i < 9; i++) {
            int digito = Integer.parseInt(ruc.substring(i, i + 1));
            suma += digito * coeficientes[i];
        }

        int residuo = suma % 11;
        int digitoVerificador = (residuo == 0) ? 0 : (11 - residuo);
        int digitoNoveno = Integer.parseInt(ruc.substring(9, 10));

        return digitoVerificador == digitoNoveno;
    }

    /**
     * Valida RUC de sociedad pública (Módulo 11)
     */
    private boolean validarRucSociedadPublica(String ruc) {
        int[] coeficientes = {3, 2, 7, 6, 5, 4, 3, 2};
        int suma = 0;

        for (int i = 0; i < 8; i++) {
            int digito = Integer.parseInt(ruc.substring(i, i + 1));
            suma += digito * coeficientes[i];
        }

        int residuo = suma % 11;
        int digitoVerificador = (residuo == 0) ? 0 : (11 - residuo);
        int digitoOctavo = Integer.parseInt(ruc.substring(8, 9));

        return digitoVerificador == digitoOctavo;
    }

    /**
     * Valida cédula o RUC
     */
    public boolean validarCedulaORC(String documento) {
        if (documento == null || documento.isEmpty()) {
            return false;
        }

        documento = documento.trim();

        if (documento.length() == 10) {
            return validarCedula(documento);
        } else if (documento.length() == 13) {
            return validarRuc(documento);
        }

        return false;
    }

    /**
     * Valida número de teléfono ecuatoriano
     */
    public boolean validarTelefono(String telefono) {
        if (telefono == null || telefono.isEmpty()) {
            return true; // Campo opcional
        }

        telefono = telefono.replaceAll("[\\s\\-\\(\\)]", "");

        // Celular: 09XXXXXXXX (10 dígitos)
        if (telefono.matches("^09\\d{8}$")) {
            return true;
        }

        // Teléfono fijo: 02XXXXXXX, 03XXXXXXX, etc. (9 dígitos)
        if (telefono.matches("^0[2-7]\\d{7}$")) {
            return true;
        }

        // Con código de país +593
        if (telefono.matches("^\\+593\\d{9,10}$")) {
            return true;
        }

        return false;
    }

    /**
     * Valida formato de correo electrónico
     */
    public boolean validarCorreo(String correo) {
        if (correo == null || correo.isEmpty()) {
            return true; // Campo opcional
        }

        String regex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        return correo.matches(regex);
    }

    /**
     * Obtiene mensaje de error para cédula/RUC
     */
    public String getMensajeErrorDocumento(String documento) {
        if (documento == null || documento.isEmpty()) {
            return "El número de cédula/RUC es requerido";
        }

        documento = documento.trim();

        if (!documento.matches("\\d+")) {
            return "El documento solo debe contener números";
        }

        if (documento.length() != 10 && documento.length() != 13) {
            return "La cédula debe tener 10 dígitos o el RUC 13 dígitos";
        }

        if (documento.length() == 10 && !validarCedula(documento)) {
            return "La cédula ingresada no es válida";
        }

        if (documento.length() == 13 && !validarRuc(documento)) {
            return "El RUC ingresado no es válido";
        }

        return null;
    }
}
