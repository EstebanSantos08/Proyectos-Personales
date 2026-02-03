package com.example.calculo_polizas.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.calculo_polizas.Model.Automovil;
import com.example.calculo_polizas.Model.Propietario;
import com.example.calculo_polizas.Repository.AutomovilRepository;
import com.example.calculo_polizas.Repository.PropietarioRepository;

@Service
public class PolizaService {

    @Autowired
    private PropietarioRepository propietarioRepository;

    @Autowired
    private AutomovilRepository automovilRepository;

    public double calcularCostoTotal(Propietario propietario, Automovil automovil) {
        // Regla: <18 no asegurado
        if (propietario.getEdad() < 18) {
            throw new IllegalArgumentException("El propietario debe ser mayor de 18 años");
        }

        // Guardar en la base de datos
        propietarioRepository.save(propietario);
        automovilRepository.save(automovil);

        double total = 0;

        // 1. Cargo por valor del automóvil: 3.5%
        total += automovil.getValor() * 0.035;

        // 2. Cargo por modelo: A=1.1%, B=1.2%, C=1.5%
        switch (automovil.getModelo()) {
            case "A" -> total += automovil.getValor() * 0.011;
            case "B" -> total += automovil.getValor() * 0.012;
            case "C" -> total += automovil.getValor() * 0.015;
        }

        // 3. Cargo por edad: 18-24=360, 25-53=240, >53=430
        if (propietario.getEdad() >= 18 && propietario.getEdad() <= 24) {
            total += 360;
        } else if (propietario.getEdad() >= 25 && propietario.getEdad() <= 53) {
            total += 240;
        } else {
            total += 430;
        }

        // 4. Cargo por accidentes: ≤3 = $17 c/u, >3 = $21 c/u
        if (propietario.getAccidentes() <= 3) {
            total += propietario.getAccidentes() * 17;
        } else {
            total += (3 * 17) + ((propietario.getAccidentes() - 3) * 21);
        }

        return total;
    }
}
