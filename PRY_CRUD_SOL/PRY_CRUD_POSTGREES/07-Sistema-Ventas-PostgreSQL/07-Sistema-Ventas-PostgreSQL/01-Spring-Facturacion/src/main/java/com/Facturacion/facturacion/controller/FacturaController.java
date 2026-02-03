package com.Facturacion.facturacion.controller;

import com.Facturacion.facturacion.models.FacturaCompleta;
import com.Facturacion.facturacion.models.ItemFactura;
import com.Facturacion.facturacion.service.PdfService;
import com.Facturacion.facturacion.util.ValidadorEcuador;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashMap;
import java.util.Map;

@Controller
public class FacturaController {

    @Autowired
    private PdfService pdfService;

    @Autowired
    private ValidadorEcuador validador;

    // Mostrar formulario de factura
    @GetMapping("/")
    public String formularioFactura(Model model, HttpSession session) {
        FacturaCompleta factura = (FacturaCompleta) session.getAttribute("factura");
        if (factura == null) {
            factura = new FacturaCompleta();
            session.setAttribute("factura", factura);
        }
        model.addAttribute("factura", factura);
        model.addAttribute("nuevoItem", new ItemFactura());
        return "factura";
    }

    // Validar documento (cédula/RUC) vía AJAX
    @PostMapping("/api/validar/documento")
    @ResponseBody
    public Map<String, Object> validarDocumento(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        String documento = request.get("documento");

        if (documento == null || documento.trim().isEmpty()) {
            response.put("valido", false);
            response.put("mensaje", "El número de cédula/RUC es requerido");
            return response;
        }

        documento = documento.trim();
        String error = validador.getMensajeErrorDocumento(documento);

        if (error != null) {
            response.put("valido", false);
            response.put("mensaje", error);
        } else {
            response.put("valido", true);
            response.put("mensaje", documento.length() == 10 ? "Cédula válida ✓" : "RUC válido ✓");
        }

        return response;
    }

    // Validar teléfono vía AJAX
    @PostMapping("/api/validar/telefono")
    @ResponseBody
    public Map<String, Object> validarTelefono(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        String telefono = request.get("telefono");

        if (telefono == null || telefono.trim().isEmpty()) {
            response.put("valido", true);
            response.put("mensaje", "");
            return response;
        }

        if (validador.validarTelefono(telefono.trim())) {
            response.put("valido", true);
            response.put("mensaje", "Teléfono válido ✓");
        } else {
            response.put("valido", false);
            response.put("mensaje", "Formato inválido. Use: 09XXXXXXXX o 02XXXXXXX");
        }

        return response;
    }

    // Validar correo vía AJAX
    @PostMapping("/api/validar/correo")
    @ResponseBody
    public Map<String, Object> validarCorreo(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        String correo = request.get("correo");

        if (correo == null || correo.trim().isEmpty()) {
            response.put("valido", true);
            response.put("mensaje", "");
            return response;
        }

        if (validador.validarCorreo(correo.trim())) {
            response.put("valido", true);
            response.put("mensaje", "Correo válido ✓");
        } else {
            response.put("valido", false);
            response.put("mensaje", "Formato de correo inválido");
        }

        return response;
    }

    // Guardar datos del cliente con validación
    @PostMapping("/guardarCliente")
    public String guardarCliente(@RequestParam String razonSocial,
                                  @RequestParam String rucCliente,
                                  @RequestParam String direccionCliente,
                                  @RequestParam(required = false) String correo,
                                  @RequestParam(required = false) String telefono,
                                  HttpSession session,
                                  RedirectAttributes redirectAttributes) {
        
        // Validar razón social
        if (razonSocial == null || razonSocial.trim().isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "La razón social es requerida");
            return "redirect:/";
        }

        if (razonSocial.trim().length() < 3) {
            redirectAttributes.addFlashAttribute("error", "La razón social debe tener al menos 3 caracteres");
            return "redirect:/";
        }

        // Validar cédula/RUC
        String errorDocumento = validador.getMensajeErrorDocumento(rucCliente);
        if (errorDocumento != null) {
            redirectAttributes.addFlashAttribute("error", errorDocumento);
            return "redirect:/";
        }

        // Validar dirección
        if (direccionCliente == null || direccionCliente.trim().isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "La dirección es requerida");
            return "redirect:/";
        }

        if (direccionCliente.trim().length() < 5) {
            redirectAttributes.addFlashAttribute("error", "La dirección debe tener al menos 5 caracteres");
            return "redirect:/";
        }

        // Validar teléfono (opcional)
        if (telefono != null && !telefono.trim().isEmpty() && !validador.validarTelefono(telefono)) {
            redirectAttributes.addFlashAttribute("error", "El formato del teléfono no es válido. Use: 09XXXXXXXX o 02XXXXXXX");
            return "redirect:/";
        }

        // Validar correo (opcional)
        if (correo != null && !correo.trim().isEmpty() && !validador.validarCorreo(correo)) {
            redirectAttributes.addFlashAttribute("error", "El formato del correo electrónico no es válido");
            return "redirect:/";
        }

        // Todo válido, guardar datos
        FacturaCompleta factura = (FacturaCompleta) session.getAttribute("factura");
        if (factura == null) {
            factura = new FacturaCompleta();
        }
        factura.setRazonSocialCliente(razonSocial.trim().toUpperCase());
        factura.setRucCliente(rucCliente.trim());
        factura.setDireccionCliente(direccionCliente.trim().toUpperCase());
        factura.setCorreoCliente(correo != null ? correo.trim().toLowerCase() : "");
        factura.setTelefonoCliente(telefono != null ? telefono.trim() : "");
        session.setAttribute("factura", factura);
        
        redirectAttributes.addFlashAttribute("exito", "Datos del cliente guardados correctamente ✓");
        return "redirect:/";
    }

    // Agregar item a la factura con validación
    @PostMapping("/agregarItem")
    public String agregarItem(@RequestParam String codigo,
                               @RequestParam String descripcion,
                               @RequestParam int cantidad,
                               @RequestParam double precioUnitario,
                               @RequestParam(defaultValue = "0") double descuento,
                               HttpSession session,
                               RedirectAttributes redirectAttributes) {
        
        // Validar código
        if (codigo == null || codigo.trim().isEmpty()) {
            redirectAttributes.addFlashAttribute("errorItem", "El código del producto es requerido");
            return "redirect:/";
        }

        // Validar descripción
        if (descripcion == null || descripcion.trim().isEmpty()) {
            redirectAttributes.addFlashAttribute("errorItem", "La descripción del producto es requerida");
            return "redirect:/";
        }

        if (descripcion.trim().length() < 3) {
            redirectAttributes.addFlashAttribute("errorItem", "La descripción debe tener al menos 3 caracteres");
            return "redirect:/";
        }

        // Validar cantidad
        if (cantidad < 1) {
            redirectAttributes.addFlashAttribute("errorItem", "La cantidad debe ser mayor a 0");
            return "redirect:/";
        }

        // Validar precio
        if (precioUnitario <= 0) {
            redirectAttributes.addFlashAttribute("errorItem", "El precio debe ser mayor a 0");
            return "redirect:/";
        }

        // Validar descuento
        if (descuento < 0) {
            redirectAttributes.addFlashAttribute("errorItem", "El descuento no puede ser negativo");
            return "redirect:/";
        }

        double totalItem = cantidad * precioUnitario;
        if (descuento > totalItem) {
            redirectAttributes.addFlashAttribute("errorItem", "El descuento no puede ser mayor al total del item ($" + String.format("%.2f", totalItem) + ")");
            return "redirect:/";
        }

        FacturaCompleta factura = (FacturaCompleta) session.getAttribute("factura");
        if (factura == null) {
            factura = new FacturaCompleta();
        }
        factura.agregarItem(codigo.trim().toUpperCase(), descripcion.trim().toUpperCase(), cantidad, precioUnitario, descuento);
        session.setAttribute("factura", factura);
        
        redirectAttributes.addFlashAttribute("exitoItem", "Producto agregado correctamente ✓");
        return "redirect:/";
    }

    // Eliminar item de la factura
    @PostMapping("/eliminarItem")
    public String eliminarItem(@RequestParam int index, HttpSession session) {
        FacturaCompleta factura = (FacturaCompleta) session.getAttribute("factura");
        if (factura != null && index >= 0 && index < factura.getItems().size()) {
            factura.getItems().remove(index);
            // Renumerar items
            for (int i = 0; i < factura.getItems().size(); i++) {
                factura.getItems().get(i).setNumero(i + 1);
            }
            factura.calcularTotales();
            session.setAttribute("factura", factura);
        }
        return "redirect:/";
    }

    // Nueva factura (limpiar todo)
    @PostMapping("/nuevaFactura")
    public String nuevaFactura(HttpSession session) {
        session.removeAttribute("factura");
        return "redirect:/";
    }

    // Generar PDF
    @GetMapping("/generarPdf")
    public ResponseEntity<byte[]> generarPdf(HttpSession session) {
        try {
            FacturaCompleta factura = (FacturaCompleta) session.getAttribute("factura");
            if (factura == null || factura.getItems().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

            // Validar que tenga datos del cliente
            if (factura.getRazonSocialCliente() == null || factura.getRazonSocialCliente().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

            byte[] pdfBytes = pdfService.generarFacturaPdf(factura);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "factura_" + factura.getNumeroFactura() + ".pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}