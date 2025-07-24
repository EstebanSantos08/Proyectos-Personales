// ============================================
// FUNCIONES PARA MEJORAR EL PROYECTO
// Escuela San Sebastián - Sistema de Gestión
// ============================================

// ==========================================
// 1. GESTIÓN DE DATOS Y ALMACENAMIENTO LOCAL
// ==========================================

class DataManager {
    constructor() {
        this.storageKey = 'sansebastian_students';
        this.backupKey = 'sansebastian_backup';
        this.initializeData();
    }

    // Inicializar datos por defecto
    initializeData() {
        if (!localStorage.getItem(this.storageKey)) {
            const defaultData = [
                {
                    id: 1, nombres: "María José", apellidos: "García López", fechaNacimiento: "2015-03-15",
                    grado: "preescolar", telefono: "555-0101", email: "maria.garcia@email.com",
                    direccion: "Calle 123 #45-67", estado: "activo", fechaInscripcion: "2024-02-01",
                    notas: { matematicas: 4.5, español: 4.8, ciencias: 4.2, ingles: 4.0 },
                    observaciones: "Estudiante destacada en lectura"
                },
                {
                    id: 2, nombres: "Carlos Andrés", apellidos: "Rodríguez Pérez", fechaNacimiento: "2014-07-22",
                    grado: "1ro", telefono: "555-0102", email: "carlos.rodriguez@email.com",
                    direccion: "Avenida 89 #12-34", estado: "activo", fechaInscripcion: "2024-02-01",
                    notas: { matematicas: 3.8, español: 4.1, ciencias: 4.3, ingles: 3.9 },
                    observaciones: "Excelente en ciencias naturales"
                },
                {
                    id: 3, nombres: "Ana Sofía", apellidos: "Martínez Silva", fechaNacimiento: "2013-11-08",
                    grado: "2do", telefono: "555-0103", email: "ana.martinez@email.com",
                    direccion: "Carrera 56 #78-90", estado: "activo", fechaInscripcion: "2024-02-01",
                    notas: { matematicas: 4.7, español: 4.9, ciencias: 4.5, ingles: 4.3 },
                    observaciones: "Líder natural, ayuda a sus compañeros"
                }
            ];
            this.saveData(defaultData);
        }
    }

    // Obtener todos los datos
    getData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al obtener datos:', error);
            return [];
        }
    }

    // Guardar datos
    saveData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            this.createBackup(data);
            return true;
        } catch (error) {
            console.error('Error al guardar datos:', error);
            return false;
        }
    }

    // Crear backup
    createBackup(data) {
        const backup = {
            data: data,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        localStorage.setItem(this.backupKey, JSON.stringify(backup));
    }

    // Restaurar backup
    restoreBackup() {
        try {
            const backup = localStorage.getItem(this.backupKey);
            if (backup) {
                const backupData = JSON.parse(backup);
                this.saveData(backupData.data);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error al restaurar backup:', error);
            return false;
        }
    }

    // Limpiar datos
    clearData() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.backupKey);
    }
}

// ==========================================
// 2. VALIDACIONES Y UTILIDADES
// ==========================================

class ValidationUtils {
    // Validar email
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validar teléfono (formato colombiano)
    static isValidPhone(phone) {
        const phoneRegex = /^(\+57|57)?[\s-]?3[0-9]{9}$|^(\+57|57)?[\s-]?[1-8][0-9]{6,7}$/;
        return phoneRegex.test(phone.replace(/[\s-]/g, ''));
    }

    // Validar fecha de nacimiento
    static isValidBirthDate(date) {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 3 && age <= 18;
    }

    // Validar nombres (solo letras y espacios)
    static isValidName(name) {
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        return nameRegex.test(name) && name.trim().length >= 2;
    }

    // Sanitizar entrada de texto
    static sanitizeInput(input) {
        return input.trim().replace(/[<>'"]/g, '');
    }

    // Generar ID único
    static generateUniqueId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }
}

// ==========================================
// 3. ANIMACIONES Y EFECTOS VISUALES
// ==========================================

class AnimationEffects {
    // Efecto de aparición gradual
    static fadeIn(element, duration = 500) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.opacity = Math.min(progress / duration, 1);
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate);
    }

    // Efecto de desaparición gradual
    static fadeOut(element, duration = 500) {
        let start = null;
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.opacity = Math.max(1 - (progress / duration), 0);
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        }
        requestAnimationFrame(animate);
    }

    // Efecto de deslizamiento
    static slideDown(element, duration = 300) {
        element.style.maxHeight = '0';
        element.style.overflow = 'hidden';
        element.style.display = 'block';
        
        const height = element.scrollHeight;
        let start = null;
        
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const currentHeight = Math.min((progress / duration) * height, height);
            element.style.maxHeight = currentHeight + 'px';
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.maxHeight = 'none';
            }
        }
        requestAnimationFrame(animate);
    }

    // Efecto de rebote para botones
    static bounceEffect(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = 'scale(1.05)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 100);
        }, 100);
    }

    // Efecto de partículas para celebración
    static createParticles(container, color = '#007bff') {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                animation: particle-${i} 1s ease-out forwards;
            `;
            
            const angle = (i / 20) * Math.PI * 2;
            const distance = 100 + Math.random() * 50;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            const keyframes = `
                @keyframes particle-${i} {
                    0% { transform: translate(0, 0) scale(1); opacity: 1; }
                    100% { transform: translate(${x}px, ${y}px) scale(0); opacity: 0; }
                }
            `;
            
            if (!document.getElementById(`particle-style-${i}`)) {
                const style = document.createElement('style');
                style.id = `particle-style-${i}`;
                style.textContent = keyframes;
                document.head.appendChild(style);
            }
            
            container.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    }
}

// ==========================================
// 4. NOTIFICACIONES Y ALERTAS
// ==========================================

class NotificationSystem {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
        return container;
    }

    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        const id = 'notification-' + Date.now();
        
        notification.id = id;
        notification.className = `alert alert-${type} alert-dismissible fade show shadow-lg`;
        notification.style.cssText = `
            margin-bottom: 10px;
            border-radius: 10px;
            border: none;
            backdrop-filter: blur(10px);
            animation: slideInRight 0.3s ease-out;
        `;
        
        const icons = {
            success: 'check-circle-fill',
            error: 'exclamation-triangle-fill',
            warning: 'exclamation-circle-fill',
            info: 'info-circle-fill'
        };
        
        notification.innerHTML = `
            <i class="bi bi-${icons[type]} me-2"></i>
            ${message}
            <button type="button" class="btn-close" onclick="notificationSystem.hide('${id}')"></button>
        `;
        
        this.container.appendChild(notification);
        
        // Auto-hide
        if (duration > 0) {
            setTimeout(() => this.hide(id), duration);
        }
        
        return id;
    }

    hide(id) {
        const notification = document.getElementById(id);
        if (notification) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }

    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 5000) {
        return this.show(message, 'danger', duration);
    }

    warning(message, duration = 4000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }
}

// ==========================================
// 5. EXPORTACIÓN Y REPORTES
// ==========================================

class ReportGenerator {
    // Exportar a CSV
    static exportToCSV(data, filename = 'estudiantes.csv') {
        const headers = ['ID', 'Nombres', 'Apellidos', 'Fecha Nacimiento', 'Grado', 'Teléfono', 'Email', 'Dirección', 'Estado', 'Promedio'];
        
        const csvContent = [
            headers.join(','),
            ...data.map(student => [
                student.id,
                `"${student.nombres}"`,
                `"${student.apellidos}"`,
                student.fechaNacimiento,
                student.grado,
                student.telefono,
                `"${student.email}"`,
                `"${student.direccion}"`,
                student.estado,
                student.notas ? this.calculateAverage(student.notas).toFixed(1) : 'N/A'
            ].join(','))
        ].join('\n');

        // Agregar timestamp al nombre del archivo
        const timestamp = new Date().toISOString().split('T')[0];
        const finalFilename = `registros/${timestamp}_${filename}`;
        
        this.downloadFile(csvContent, finalFilename, 'text/csv');
        
        // También guardar una copia local si es posible
        this.saveToLocalStorage('csv_reports', {
            filename: finalFilename,
            content: csvContent,
            timestamp: new Date().toISOString(),
            type: 'CSV'
        });
    }

    // Exportar a JSON
    static exportToJSON(data, filename = 'estudiantes.json') {
        const jsonContent = JSON.stringify({
            metadata: {
                generatedAt: new Date().toISOString(),
                totalStudents: data.length,
                school: 'Escuela San Sebastián',
                version: '1.0'
            },
            students: data
        }, null, 2);
        
        // Agregar timestamp al nombre del archivo
        const timestamp = new Date().toISOString().split('T')[0];
        const finalFilename = `registros/${timestamp}_${filename}`;
        
        this.downloadFile(jsonContent, finalFilename, 'application/json');
        
        // También guardar una copia local
        this.saveToLocalStorage('json_reports', {
            filename: finalFilename,
            content: jsonContent,
            timestamp: new Date().toISOString(),
            type: 'JSON'
        });
    }

    // Generar reporte PDF (básico)
    static generatePDFReport(data) {
        const reportContent = this.generateReportHTML(data);
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `registros/${timestamp}_reporte_estudiantes.pdf`;
        
        // Crear ventana para imprimir
        const newWindow = window.open('', '_blank');
        newWindow.document.write(reportContent);
        newWindow.document.close();
        
        // Configurar para guardar como PDF
        newWindow.addEventListener('load', () => {
            setTimeout(() => {
                newWindow.print();
                // Guardar metadatos del reporte
                this.saveToLocalStorage('pdf_reports', {
                    filename: filename,
                    timestamp: new Date().toISOString(),
                    type: 'PDF',
                    studentsCount: data.length
                });
            }, 1000);
        });
        
        return filename;
    }

    // Generar HTML para reporte mejorado
    static generateReportHTML(data) {
        const stats = this.generateStatistics(data);
        const timestamp = new Date();
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Reporte de Estudiantes - Escuela San Sebastián</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 20px; 
                        line-height: 1.6;
                    }
                    .header { 
                        text-align: center; 
                        margin-bottom: 30px; 
                        border-bottom: 2px solid #007bff;
                        padding-bottom: 20px;
                    }
                    .logo {
                        font-size: 2rem;
                        color: #007bff;
                        margin-bottom: 10px;
                    }
                    .stats { 
                        display: flex; 
                        justify-content: space-around; 
                        margin: 20px 0;
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 10px;
                    }
                    .stat-box { 
                        text-align: center; 
                        padding: 10px; 
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        background: white;
                        min-width: 120px;
                    }
                    .stat-number {
                        font-size: 2rem;
                        font-weight: bold;
                        color: #007bff;
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-top: 20px;
                        font-size: 0.9rem;
                    }
                    th, td { 
                        border: 1px solid #ddd; 
                        padding: 8px; 
                        text-align: left; 
                    }
                    th { 
                        background-color: #007bff;
                        color: white;
                        font-weight: bold;
                    }
                    tr:nth-child(even) {
                        background-color: #f8f9fa;
                    }
                    .print-info { 
                        text-align: right; 
                        font-size: 12px; 
                        color: #666; 
                        margin-top: 20px;
                        border-top: 1px solid #ddd;
                        padding-top: 10px;
                    }
                    .footer {
                        margin-top: 30px;
                        text-align: center;
                        color: #666;
                        font-size: 0.9rem;
                    }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">🎓 Escuela San Sebastián</div>
                    <h1>Reporte de Estudiantes</h1>
                    <p>Formando líderes del mañana</p>
                </div>
                
                <div class="stats">
                    <div class="stat-box">
                        <div class="stat-number">${stats.total}</div>
                        <p>Total Estudiantes</p>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number">${stats.active}</div>
                        <p>Estudiantes Activos</p>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number">${stats.averageGrade.toFixed(1)}</div>
                        <p>Promedio General</p>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number">${new Set(data.map(s => s.grado)).size}</div>
                        <p>Cursos</p>
                    </div>
                </div>
                
                <h3>Listado Completo de Estudiantes</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre Completo</th>
                            <th>Grado</th>
                            <th>Edad</th>
                            <th>Estado</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Promedio</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(student => `
                            <tr>
                                <td>${student.id}</td>
                                <td>${student.nombres} ${student.apellidos}</td>
                                <td>${student.grado}</td>
                                <td>${this.calculateAge(student.fechaNacimiento)} años</td>
                                <td>${student.estado}</td>
                                <td>${student.telefono}</td>
                                <td>${student.email}</td>
                                <td>${student.notas ? this.calculateAverage(student.notas).toFixed(1) : 'N/A'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="footer">
                    <p><strong>Escuela San Sebastián</strong> - Sistema de Gestión Estudiantil</p>
                    <p>📧 info@sansebastian.edu | 📞 (123) 456-7890</p>
                </div>
                
                <div class="print-info">
                    <p><strong>Información del Reporte:</strong></p>
                    <p>Generado el: ${timestamp.toLocaleDateString('es-ES')} a las ${timestamp.toLocaleTimeString('es-ES')}</p>
                    <p>Archivo: registros/${timestamp.toISOString().split('T')[0]}_reporte_estudiantes.pdf</p>
                    <p>Total de páginas: [Se generará automáticamente al imprimir]</p>
                </div>
            </body>
            </html>
        `;
    }

    // Calcular edad
    static calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }

    // Calcular promedio de notas
    static calculateAverage(notas) {
        if (!notas || typeof notas !== 'object') return 0;
        const values = Object.values(notas);
        return values.reduce((sum, grade) => sum + grade, 0) / values.length;
    }

    // Generar estadísticas
    static generateStatistics(data) {
        const total = data.length;
        const active = data.filter(s => s.estado === 'activo').length;
        const grades = data.filter(s => s.notas).map(s => this.calculateAverage(s.notas));
        const averageGrade = grades.length > 0 ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length : 0;
        
        return { total, active, averageGrade };
    }

    // Descargar archivo
    static downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Mostrar confirmación
        if (window.notificationSystem) {
            notificationSystem.success(`Archivo guardado: ${filename}`);
        }
    }

    // Guardar en localStorage como backup
    static saveToLocalStorage(key, reportData) {
        try {
            let reports = JSON.parse(localStorage.getItem(key) || '[]');
            reports.unshift(reportData); // Agregar al inicio
            
            // Mantener solo los últimos 10 reportes
            if (reports.length > 10) {
                reports = reports.slice(0, 10);
            }
            
            localStorage.setItem(key, JSON.stringify(reports));
        } catch (error) {
            console.warn('No se pudo guardar el reporte en localStorage:', error);
        }
    }

    // Obtener historial de reportes
    static getReportHistory() {
        try {
            const csvReports = JSON.parse(localStorage.getItem('csv_reports') || '[]');
            const jsonReports = JSON.parse(localStorage.getItem('json_reports') || '[]');
            const pdfReports = JSON.parse(localStorage.getItem('pdf_reports') || '[]');
            
            return {
                csv: csvReports,
                json: jsonReports,
                pdf: pdfReports,
                total: csvReports.length + jsonReports.length + pdfReports.length
            };
        } catch (error) {
            console.warn('Error al obtener historial de reportes:', error);
            return { csv: [], json: [], pdf: [], total: 0 };
        }
    }

    // Limpiar historial de reportes
    static clearReportHistory() {
        localStorage.removeItem('csv_reports');
        localStorage.removeItem('json_reports');
        localStorage.removeItem('pdf_reports');
        
        if (window.notificationSystem) {
            notificationSystem.info('Historial de reportes limpiado');
        }
    }

    // Generar reporte de estadísticas por curso
    static generateCourseStatisticsReport(data) {
        const courseStats = {};
        
        // Agrupar por curso
        data.forEach(student => {
            if (!courseStats[student.grado]) {
                courseStats[student.grado] = {
                    total: 0,
                    active: 0,
                    grades: [],
                    students: []
                };
            }
            
            courseStats[student.grado].total++;
            if (student.estado === 'activo') {
                courseStats[student.grado].active++;
            }
            if (student.notas) {
                courseStats[student.grado].grades.push(this.calculateAverage(student.notas));
            }
            courseStats[student.grado].students.push(student);
        });
        
        // Generar contenido del reporte
        const reportContent = Object.keys(courseStats).map(course => {
            const stats = courseStats[course];
            const avgGrade = stats.grades.length > 0 ? 
                stats.grades.reduce((sum, g) => sum + g, 0) / stats.grades.length : 0;
            
            return {
                curso: course,
                totalEstudiantes: stats.total,
                estudiantesActivos: stats.active,
                promedioGeneral: avgGrade.toFixed(1),
                porcentajeActivos: ((stats.active / stats.total) * 100).toFixed(1)
            };
        });
        
        const csvContent = [
            'Curso,Total Estudiantes,Estudiantes Activos,Promedio General,Porcentaje Activos',
            ...reportContent.map(row => 
                `${row.curso},${row.totalEstudiantes},${row.estudiantesActivos},${row.promedioGeneral},${row.porcentajeActivos}%`
            )
        ].join('\n');
        
        const timestamp = new Date().toISOString().split('T')[0];
        this.downloadFile(csvContent, `registros/${timestamp}_estadisticas_por_curso.csv`, 'text/csv');
        
        return reportContent;
    }
}

// ==========================================
// 6. BÚSQUEDA AVANZADA Y FILTROS
// ==========================================

class SearchEngine {
    constructor(data) {
        this.data = data;
        this.filters = {};
    }

    // Búsqueda por texto
    searchByText(query) {
        if (!query || query.trim() === '') return this.data;
        
        const searchTerm = query.toLowerCase().trim();
        return this.data.filter(student => 
            student.nombres.toLowerCase().includes(searchTerm) ||
            student.apellidos.toLowerCase().includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm) ||
            student.telefono.includes(searchTerm) ||
            student.id.toString().includes(searchTerm)
        );
    }

    // Filtrar por grado
    filterByGrade(grade) {
        if (!grade) return this.data;
        return this.data.filter(student => student.grado === grade);
    }

    // Filtrar por estado
    filterByStatus(status) {
        if (!status) return this.data;
        return this.data.filter(student => student.estado === status);
    }

    // Filtrar por edad
    filterByAge(minAge, maxAge) {
        return this.data.filter(student => {
            const age = this.calculateAge(student.fechaNacimiento);
            return age >= minAge && age <= maxAge;
        });
    }

    // Búsqueda combinada
    search(options = {}) {
        let results = [...this.data];
        
        if (options.text) {
            const searchTerm = options.text.toLowerCase().trim();
            results = results.filter(student => 
                student.nombres.toLowerCase().includes(searchTerm) ||
                student.apellidos.toLowerCase().includes(searchTerm) ||
                student.email.toLowerCase().includes(searchTerm) ||
                student.telefono.includes(searchTerm)
            );
        }
        
        if (options.grade) {
            results = results.filter(student => student.grado === options.grade);
        }
        
        if (options.status) {
            results = results.filter(student => student.estado === options.status);
        }
        
        if (options.minAge !== undefined && options.maxAge !== undefined) {
            results = results.filter(student => {
                const age = this.calculateAge(student.fechaNacimiento);
                return age >= options.minAge && age <= options.maxAge;
            });
        }
        
        return results;
    }

    // Calcular edad
    calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }

    // Ordenar resultados
    sort(results, field, direction = 'asc') {
        return results.sort((a, b) => {
            let valueA = a[field];
            let valueB = b[field];
            
            if (field === 'edad') {
                valueA = this.calculateAge(a.fechaNacimiento);
                valueB = this.calculateAge(b.fechaNacimiento);
            }
            
            if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }
            
            if (direction === 'asc') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });
    }
}

// ==========================================
// 7. TEMA Y PERSONALIZACIÓN
// ==========================================

class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('school-theme') || 'default';
        this.applyTheme(this.currentTheme);
    }

    // Aplicar tema
    applyTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('school-theme', themeName);
        this.currentTheme = themeName;
        
        // Agregar estilos CSS para temas
        this.injectThemeStyles(themeName);
    }

    // Inyectar estilos de tema
    injectThemeStyles(themeName) {
        const existingStyle = document.getElementById('theme-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        const style = document.createElement('style');
        style.id = 'theme-styles';
        
        const themes = {
            default: {
                primary: '#007bff',
                secondary: '#6c757d',
                success: '#28a745',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            },
            dark: {
                primary: '#0d6efd',
                secondary: '#495057',
                success: '#198754',
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
            },
            nature: {
                primary: '#28a745',
                secondary: '#6c757d',
                success: '#20c997',
                background: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)'
            },
            sunset: {
                primary: '#fd7e14',
                secondary: '#6c757d',
                success: '#ffc107',
                background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)'
            }
        };
        
        const theme = themes[themeName] || themes.default;
        
        style.textContent = `
            [data-theme="${themeName}"] {
                --bs-primary: ${theme.primary};
                --bs-secondary: ${theme.secondary};
                --bs-success: ${theme.success};
            }
            [data-theme="${themeName}"] body {
                background: ${theme.background} !important;
            }
        `;
        
        document.head.appendChild(style);
    }

    // Alternar tema oscuro
    toggleDarkMode() {
        const newTheme = this.currentTheme === 'dark' ? 'default' : 'dark';
        this.applyTheme(newTheme);
    }

    // Obtener temas disponibles
    getAvailableThemes() {
        return ['default', 'dark', 'nature', 'sunset'];
    }
}

// ==========================================
// 8. INICIALIZACIÓN Y CONFIGURACIÓN GLOBAL
// ==========================================

// Instancias globales
let dataManager;
let notificationSystem;
let themeManager;
let searchEngine;

// Función de inicialización
function initializeSystem() {
    // Crear instancias globales
    dataManager = new DataManager();
    notificationSystem = new NotificationSystem();
    themeManager = new ThemeManager();
    
    // Agregar estilos de animación
    addAnimationStyles();
    
    // Configurar eventos globales
    setupGlobalEvents();
    
    // Mostrar mensaje de bienvenida
    setTimeout(() => {
        notificationSystem.success('Sistema iniciado correctamente', 2000);
    }, 1000);
}

// Agregar estilos de animación
function addAnimationStyles() {
    if (document.getElementById('animation-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'animation-styles';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        .animate-pulse {
            animation: pulse 2s infinite;
        }
        .animate-bounce:hover {
            animation: bounce 0.5s;
        }
        @keyframes bounce {
            0%, 20%, 60%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            80% { transform: translateY(-5px); }
        }
    `;
    document.head.appendChild(style);
}

// Configurar eventos globales
function setupGlobalEvents() {
    // Atajos de teclado
    document.addEventListener('keydown', function(e) {
        // Ctrl + S para guardar
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            if (typeof saveCurrentData === 'function') {
                saveCurrentData();
            }
        }
        
        // Ctrl + F para buscar
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.getElementById('searchStudent') || document.querySelector('input[type="search"]');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // ESC para cerrar modales
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
                const bsModal = bootstrap.Modal.getInstance(modal);
                if (bsModal) bsModal.hide();
            });
        }
    });
    
    // Auto-guardar cada 5 minutos
    setInterval(() => {
        if (typeof autoSave === 'function') {
            autoSave();
        }
    }, 300000);
    
    // Guardar antes de cerrar la página
    window.addEventListener('beforeunload', function(e) {
        if (typeof hasUnsavedChanges === 'function' && hasUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = '¿Estás seguro de que quieres salir? Hay cambios sin guardar.';
        }
    });
}

// Función para cargar el sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeSystem);

// Exportar funciones globales para uso en otras páginas
window.DataManager = DataManager;
window.ValidationUtils = ValidationUtils;
window.AnimationEffects = AnimationEffects;
window.NotificationSystem = NotificationSystem;
window.ReportGenerator = ReportGenerator;
window.SearchEngine = SearchEngine;
window.ThemeManager = ThemeManager;

// Variables globales para compatibilidad
window.dataManager = dataManager;
window.notificationSystem = notificationSystem;
window.themeManager = themeManager;

console.log('🎓 Sistema de Gestión Escolar San Sebastián inicializado correctamente');
