package com.example.calculo_polizas.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.calculo_polizas.DTO.PolizaDTO;
import com.example.calculo_polizas.DTO.PolizaRequestDTO;
import com.example.calculo_polizas.Model.Automovil;
import com.example.calculo_polizas.Model.Propietario;
import com.example.calculo_polizas.services.PolizaService;

@RestController
@RequestMapping("api/poliza")
public class PolizaController {

    // Instanciar el servicio
    private final PolizaService servicio;

    public PolizaController(PolizaService servicio) {
        this.servicio = servicio;
    }

    @GetMapping("/calcular")
    public PolizaDTO calcularDto(
            @RequestParam String nombre,
            @RequestParam Integer edad,
            @RequestParam Integer numeroAccidentes,
            @RequestParam Double valor,
            @RequestParam String modelo) {

        PolizaDTO dto = new PolizaDTO();
        dto.setPropietarioNombre(nombre);

        // Validación de edad
        if (edad < 18) {
            dto.setExitoso(false);
            dto.setMensaje("Error: El propietario debe ser mayor de 18 años. Edad proporcionada: " + edad + " años. No se puede asegurar a menores de edad.");
            dto.setCostoTotal(0);
            return dto;
        }

        // Validación de edad negativa
        if (edad < 0) {
            dto.setExitoso(false);
            dto.setMensaje("Error: La edad no puede ser negativa.");
            dto.setCostoTotal(0);
            return dto;
        }

        // Validación de accidentes negativos
        if (numeroAccidentes < 0) {
            dto.setExitoso(false);
            dto.setMensaje("Error: El número de accidentes no puede ser negativo.");
            dto.setCostoTotal(0);
            return dto;
        }

        // Validación de valor del automóvil
        if (valor <= 0) {
            dto.setExitoso(false);
            dto.setMensaje("Error: El valor del automóvil debe ser mayor a 0.");
            dto.setCostoTotal(0);
            return dto;
        }

        // Validación de modelo
        if (!modelo.equals("A") && !modelo.equals("B") && !modelo.equals("C")) {
            dto.setExitoso(false);
            dto.setMensaje("Error: El modelo debe ser A, B o C. Modelo proporcionado: " + modelo);
            dto.setCostoTotal(0);
            return dto;
        }

        Propietario p = new Propietario();
        p.setNombre(nombre);
        p.setEdad(edad);
        p.setAccidentes(numeroAccidentes);

        Automovil a = new Automovil();
        a.setValor(valor);
        a.setModelo(modelo);

        Double costo = servicio.calcularCostoTotal(p, a);

        dto.setCostoTotal(costo);
        dto.setExitoso(true);
        dto.setCategoriaEdad(obtenerCategoriaEdad(edad));
        dto.setMensaje("Póliza calculada exitosamente. Categoría de edad: " + dto.getCategoriaEdad());

        return dto;
    }

    // Método POST
    @PostMapping("/calcular")
    public PolizaDTO calcularPoliza(@RequestBody PolizaRequestDTO request) {
        PolizaDTO dto = new PolizaDTO();
        dto.setPropietarioNombre(request.getNombre());

        // Validación de edad
        if (request.getEdad() < 18) {
            dto.setExitoso(false);
            dto.setMensaje("Error: El propietario debe ser mayor de 18 años. Edad proporcionada: " + request.getEdad() + " años. No se puede asegurar a menores de edad.");
            dto.setCostoTotal(0);
            return dto;
        }
    

        // Validación de edad negativa
        if (request.getEdad() < 0) {
            dto.setExitoso(false);
            dto.setMensaje("Error: La edad no puede ser negativa.");
            dto.setCostoTotal(0);
            return dto;
        }

        // Validación de accidentes negativos
        if (request.getAccidentes() < 0) {
            dto.setExitoso(false);
            dto.setMensaje("Error: El número de accidentes no puede ser negativo.");
            dto.setCostoTotal(0);
            return dto;
        }

        // Validación de valor del automóvil
        if (request.getValor() <= 0) {
            dto.setExitoso(false);
            dto.setMensaje("Error: El valor del automóvil debe ser mayor a 0.");
            dto.setCostoTotal(0);
            return dto;
        }

        // Validación de modelo
        if (!request.getModelo().equals("A") && !request.getModelo().equals("B") && !request.getModelo().equals("C")) {
            dto.setExitoso(false);
            dto.setMensaje("Error: El modelo debe ser A, B o C. Modelo proporcionado: " + request.getModelo());
            dto.setCostoTotal(0);
            return dto;
        }

        Propietario p = new Propietario();
        p.setNombre(request.getNombre());
        p.setEdad(request.getEdad());
        p.setAccidentes(request.getAccidentes());

        Automovil a = new Automovil();
        a.setValor(request.getValor());
        a.setModelo(request.getModelo());

        Double costo = servicio.calcularCostoTotal(p, a);

        dto.setCostoTotal(costo);
        dto.setExitoso(true);
        dto.setCategoriaEdad(obtenerCategoriaEdad(request.getEdad()));
        dto.setMensaje("Póliza calculada exitosamente. Categoría de edad: " + dto.getCategoriaEdad());

        return dto;
    }

    // Método auxiliar para obtener la categoría de edad
    private String obtenerCategoriaEdad(int edad) {
        if (edad >= 18 && edad <= 24) {
            return "Joven (18-24 años) - Cargo: $360";
        } else if (edad >= 25 && edad <= 53) {
            return "Adulto (25-53 años) - Cargo: $240";
        } else {
            return "Mayor (>53 años) - Cargo: $430";
        }
    }
}