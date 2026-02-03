# 💻 Portafolio de Programación Web Avanzada

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

**Autor:** Esteban Santos  
**Carrera:** Programación Web Avanzada  
**Año:** 2025-2026

---

## 📋 Descripción

Colección de proyectos desarrollados durante el curso de **Programación Web Avanzada**, demostrando habilidades en desarrollo full-stack, APIs REST, autenticación, y manejo de bases de datos relacionales y no relacionales.

---

## 🚀 Proyectos Destacados

### 1. 📄 Sistema de Facturación Electrónica
**Tecnologías:** Java, Spring Boot, Thymeleaf, iTextPDF

Sistema completo de facturación electrónica con las siguientes características:
- ✅ Generación de facturas en formato PDF profesional
- ✅ Validación de cédula y RUC ecuatoriano (algoritmo módulo 10 y 11)
- ✅ Validación de teléfonos y correos electrónicos
- ✅ Cálculo automático de IVA y totales
- ✅ Interfaz web moderna con Thymeleaf
- ✅ Generación de códigos de barras

📁 **Ubicación:** `Spring-Facturacion/`

```
├── controller/
│   └── FacturaController.java
├── service/
│   ├── FacturaService.java
│   └── PdfService.java
├── util/
│   └── ValidadorEcuador.java
└── templates/
    └── factura.html
```

---

### 2. 🚗 Calculadora de Pólizas de Seguros
**Tecnologías:** Spring Boot, React, Vite, Axios

Aplicación full-stack para el cálculo de pólizas de seguros de automóviles:
- ✅ Backend REST API con Spring Boot
- ✅ Frontend moderno con React + Vite
- ✅ Validación de edad, accidentes y modelos de vehículo
- ✅ Cálculo de costos basado en categorías de edad
- ✅ Diseño responsive y moderno

📁 **Ubicación:** `Calculo-Polizas/`

```
├── Backend (Spring Boot)
│   ├── Controller/
│   ├── DTO/
│   ├── Model/
│   ├── Repository/
│   └── Services/
└── Frontend (React + Vite)
    └── src/
        └── App.jsx
```

---

### 3. 🔐 Sistema de Autenticación OAuth con JWT
**Tecnologías:** Node.js, Express, JWT, React, Axios

Sistema de autenticación completo implementando:
- ✅ Autenticación basada en tokens JWT
- ✅ Rutas protegidas con middleware
- ✅ Almacenamiento seguro de tokens
- ✅ Manejo de sesiones (expiración 1 hora)
- ✅ Dashboard de usuario con perfil
- ✅ Diseño moderno con tema oscuro

📁 **Ubicación:** `OAuth-Sistema/`

```
├── backend/
│   ├── config/
│   │   └── jwt.config.js
│   ├── controllers/
│   │   ├── auth.controllers.js
│   │   └── user.controller.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   └── routes/
└── frontend/
    ├── App.jsx
    └── components/
```

---

### 4. ⚽ Gestión de Equipos y Jugadores
**Tecnologías:** Node.js, Express, Sequelize, Next.js, PrimeReact, TypeScript

Sistema CRUD completo para gestión deportiva:
- ✅ Relaciones 1:N (Equipo → Jugadores)
- ✅ Validación de números de camiseta únicos
- ✅ API REST con endpoints validados
- ✅ Frontend profesional con PrimeReact
- ✅ Filtros y búsqueda avanzada
- ✅ Arquitectura MVC

📁 **Ubicación:** `Gestion-Equipos-Jugadores/`

```
├── Backend/
│   ├── controller/
│   │   ├── equipoController.js
│   │   └── jugadorController.js
│   ├── models/
│   └── routes/
└── Frontend (Next.js + PrimeReact)
    └── app/
```

---

### 5. 💼 API REST - Gestión de Empleados con ORM
**Tecnologías:** Node.js, Express, MySQL, Sequelize

API REST completa con arquitectura MVC:
- ✅ CRUD completo de empleados
- ✅ Cálculo de reajuste de sueldos por antigüedad
- ✅ ORM Sequelize para manejo de base de datos
- ✅ Variables de entorno con dotenv
- ✅ Documentación de endpoints incluida
- ✅ Colección de Postman para pruebas

📁 **Ubicación:** `API-Empleados-ORM/`

```
├── config/
│   └── database.js
├── controllers/
│   └── empleado.controller.js
├── models/
│   └── empleado.model.js
├── routes/
│   └── empleado.routes.js
└── server.js
```

---

### 6. 🛒 Gestión de Tienda con MongoDB (ODM)
**Tecnologías:** Node.js, Express, MongoDB, Mongoose

Sistema de gestión de productos y pedidos con base de datos NoSQL:
- ✅ ODM con Mongoose
- ✅ Gestión de productos
- ✅ Gestión de pedidos
- ✅ API RESTful
- ✅ Variables de entorno configurables

📁 **Ubicación:** `Gestion-Tienda-ODM/`

```
├── src/
│   ├── config/
│   │   └── mongo.js
│   ├── controllers/
│   ├── models/
│   └── routes/
└── app.js
```

---

## 🛠️ Tecnologías Dominadas

### Backend
| Tecnología | Nivel |
|------------|-------|
| Node.js + Express | ⭐⭐⭐⭐⭐ |
| Java + Spring Boot | ⭐⭐⭐⭐⭐ |
| REST APIs | ⭐⭐⭐⭐⭐ |
| JWT Authentication | ⭐⭐⭐⭐ |

### Frontend
| Tecnología | Nivel |
|------------|-------|
| React | ⭐⭐⭐⭐⭐ |
| Next.js | ⭐⭐⭐⭐ |
| Vite | ⭐⭐⭐⭐ |
| PrimeReact | ⭐⭐⭐⭐ |
| Axios | ⭐⭐⭐⭐⭐ |

### Bases de Datos
| Tecnología | Nivel |
|------------|-------|
| MySQL | ⭐⭐⭐⭐⭐ |
| MongoDB | ⭐⭐⭐⭐ |
| Sequelize (ORM) | ⭐⭐⭐⭐⭐ |
| Mongoose (ODM) | ⭐⭐⭐⭐ |

### Herramientas
| Tecnología | Nivel |
|------------|-------|
| Git & GitHub | ⭐⭐⭐⭐ |
| Postman | ⭐⭐⭐⭐⭐ |
| VS Code | ⭐⭐⭐⭐⭐ |
| Maven | ⭐⭐⭐⭐ |

---

## 📊 Arquitecturas Implementadas

- ✅ **MVC (Model-View-Controller)** - Separación clara de responsabilidades
- ✅ **REST API** - Diseño de APIs siguiendo estándares REST
- ✅ **Cliente-Servidor** - Arquitecturas desacopladas full-stack
- ✅ **Capas de Servicio** - Controllers, Services, Repositories

---

## 🚀 Cómo Ejecutar los Proyectos

### Proyectos Node.js
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar en desarrollo
npm run dev

# O ejecutar en producción
npm start
```

### Proyectos Spring Boot
```bash
# Compilar
./mvnw clean compile

# Ejecutar
./mvnw spring-boot:run
```

### Proyectos React
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

---

## 📫 Contacto

- **GitHub:** [EstebanSantos08](https://github.com/EstebanSantos08)
- **Email:** [tu-email@ejemplo.com]
- **LinkedIn:** [Tu perfil de LinkedIn]

---

## 📜 Licencia

Este repositorio contiene proyectos académicos desarrollados como parte del curso de Programación Web Avanzada.

---

⭐ **Si te gustan estos proyectos, no olvides dar una estrella al repositorio!**
