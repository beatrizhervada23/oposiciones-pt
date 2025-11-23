// ========================================
// TEMA OSCURO/CLARO
// ========================================
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Cambiar icono
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

// Cargar tema guardado al iniciar
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
    
    // Cargar estadísticas
    loadStats();
});

// ========================================
// PESTAÑAS (TABS)
// ========================================
function openTab(evt, tabName) {
    // Ocultar todos los contenidos
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    // Desactivar todos los botones
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    // Mostrar el contenido actual y activar el botón
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// ========================================
// SECCIONES COLAPSABLES
// ========================================
function toggleCollapsible(button) {
    button.classList.toggle('active');
    const content = button.nextElementSibling;
    content.classList.toggle('active');
}

// ========================================
// MOSTRAR/OCULTAR RESPUESTAS
// ========================================
function toggleAnswer(button) {
    const answerText = button.nextElementSibling;
    
    if (answerText.classList.contains('show')) {
        answerText.classList.remove('show');
        button.textContent = 'Ver respuesta';
        button.style.background = 'var(--primary-color)';
    } else {
        answerText.classList.add('show');
        button.textContent = 'Ocultar respuesta';
        button.style.background = 'var(--success-color)';
    }
}

// ========================================
// BÚSQUEDA DE TEMAS
// ========================================
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const temaCards = document.querySelectorAll('.tema-card');
        
        temaCards.forEach(card => {
            const titulo = card.querySelector('.tema-titulo').textContent.toLowerCase();
            const descripcion = card.querySelector('.tema-descripcion').textContent.toLowerCase();
            const numero = card.querySelector('.tema-numero').textContent.toLowerCase();
            
            if (titulo.includes(searchTerm) || descripcion.includes(searchTerm) || numero.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// ========================================
// MARCAR TEMA COMO ESTUDIADO
// ========================================
function marcarEstudiado(temaNumero) {
    let temasEstudiados = JSON.parse(localStorage.getItem('temasEstudiados')) || [];
    
    if (!temasEstudiados.includes(temaNumero)) {
        temasEstudiados.push(temaNumero);
        localStorage.setItem('temasEstudiados', JSON.stringify(temasEstudiados));
        
        alert(`✅ Tema ${temaNumero} marcado como estudiado`);
        loadStats();
    } else {
        alert(`ℹ️ El Tema ${temaNumero} ya estaba marcado como estudiado`);
    }
}

// ========================================
// CARGAR ESTADÍSTICAS
// ========================================
function loadStats() {
    const totalTemas = 25;
    const temasEstudiados = JSON.parse(localStorage.getItem('temasEstudiados')) || [];
    const progreso = Math.round((temasEstudiados.length / totalTemas) * 100);
    
    const totalTemasEl = document.getElementById('total-temas');
    const temasEstudiadosEl = document.getElementById('temas-estudiados');
    const progresoEl = document.getElementById('progreso');
    
    if (totalTemasEl) totalTemasEl.textContent = totalTemas;
    if (temasEstudiadosEl) temasEstudiadosEl.textContent = temasEstudiados.length;
    if (progresoEl) progresoEl.textContent = progreso + '%';
}

// ========================================
// CRONÓMETRO PARA SIMULACRO
// ========================================
let timerInterval;
let timerSeconds = 7200; // 2 horas = 7200 segundos
let isPaused = false;

function startTimer() {
    if (timerInterval) return; // Ya está corriendo
    
    isPaused = false;
    timerInterval = setInterval(() => {
        if (!isPaused) {
            timerSeconds--;
            updateTimerDisplay();
            
            if (timerSeconds <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                alert('⏰ ¡Tiempo terminado! Has completado las 2 horas de simulacro.');
                playNotificationSound();
            }
        }
    }, 1000);
}

function pauseTimer() {
    isPaused = !isPaused;
    const pauseBtn = document.querySelector('.timer-controls .btn-secondary');
    if (pauseBtn) {
        pauseBtn.textContent = isPaused ? '▶️ Reanudar' : '⏸️ Pausar';
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerSeconds = 7200;
    isPaused = false;
    updateTimerDisplay();
    
    const pauseBtn = document.querySelector('.timer-controls .btn-secondary');
    if (pauseBtn) {
        pauseBtn.textContent = '⏸️ Pausar';
    }
}

function updateTimerDisplay() {
    const hours = Math.floor(timerSeconds / 3600);
    const minutes = Math.floor((timerSeconds % 3600) / 60);
    const seconds = timerSeconds % 60;
    
    const display = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    const timerEl = document.getElementById('timer');
    if (timerEl) {
        timerEl.textContent = display;
        
        // Cambiar color si queda poco tiempo
        if (timerSeconds <= 300) { // 5 minutos
            timerEl.style.color = 'var(--danger-color)';
        } else if (timerSeconds <= 600) { // 10 minutos
            timerEl.style.color = 'var(--warning-color)';
        } else {
            timerEl.style.color = 'var(--primary-color)';
        }
    }
}

function playNotificationSound() {
    // Sonido simple de notificación usando Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('No se pudo reproducir el sonido');
    }
}

// ========================================
// ATAJOS DE TECLADO
// ========================================
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + D = Cambiar tema
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        toggleTheme();
    }
    
    // Ctrl/Cmd + K = Enfocar búsqueda
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
    }
});

// ========================================
// IMPRIMIR TEMA
// ========================================
function printTheme() {
    window.print();
}

// ========================================
// PROGRESO DE LECTURA
// ========================================
window.addEventListener('scroll', function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // Puedes añadir una barra de progreso en el futuro
    // document.getElementById("progressBar").style.width = scrolled + "%";
});

// ========================================
// SMOOTH SCROLL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// GUARDAR NOTAS (FUTURO)
// ========================================
function saveNotes(temaId, notes) {
    localStorage.setItem(`notas-tema-${temaId}`, notes);
}

function loadNotes(temaId) {
    return localStorage.getItem(`notas-tema-${temaId}`) || '';
}

// ========================================
// EXPORTAR ESTADÍSTICAS
// ========================================
function exportarEstadisticas() {
    const stats = {
        temasEstudiados: JSON.parse(localStorage.getItem('temasEstudiados')) || [],
        fechaExportacion: new Date().toISOString(),
        totalTemas: 25
    };
    
    const dataStr = JSON.stringify(stats, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'estadisticas-oposiciones-pt.json';
    link.click();
}

// ========================================
// MODO PRESENTACIÓN (FUTURO)
// ========================================
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// ========================================
// INICIALIZACIÓN
// ========================================
console.log('🎓 Sitio de estudio cargado correctamente');
console.log('💡 Atajos: Ctrl+D (cambiar tema) | Ctrl+K (buscar)');
