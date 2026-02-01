package com.example.calculo_polizas.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.calculo_polizas.Model.Automovil;

public interface AutomovilRepository extends JpaRepository<Automovil, Long> {
}
