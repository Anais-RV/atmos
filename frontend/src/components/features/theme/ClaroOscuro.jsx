import { useState, useEffect } from 'react';

import './ClaroOscuro.css';

// 1. Hook para obtener el esquema de color del sistema (Web Equivalent)
const useWebColorScheme = () => {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return null;
    }
    // Retorna 'dark' o 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};


function ClaroOscuro() {
    const systemScheme = useWebColorScheme();

    // 🛑 CAMBIO 1: Inicialización Directa 🛑
    // Asumimos que TRUE significa Oscuro, aunque luego invertiremos la salida.
    const [isDarkMode, setIsDarkMode] = useState(systemScheme === 'dark'); 
    
    // Función para alternar el estado
    const toggleTheme = () => setIsDarkMode(prev => !prev);

    // 🛑 CAMBIO 2: Invertir la Lógica en useEffect 🛑
    // Si isDarkMode es TRUE (esperamos modo Oscuro), aplicamos la clase 'light-mode',
    // lo cual revierte el comportamiento anterior si estaba invertido.
    useEffect(() => {
        document.body.classList.remove('light-mode', 'dark-mode'); 
        
        // ⬅️ INVERSIÓN DE LA CLASE:
        // Si isDarkMode es TRUE, se aplica 'light-mode' (claro)
        // Si isDarkMode es FALSE, se aplica 'dark-mode' (oscuro)
        const modeClass = isDarkMode ? 'light-mode' : 'dark-mode'; 
        
        document.body.classList.add(modeClass);
    }, [isDarkMode]);

    // 🛑 CAMBIO 3: Invertir la Lógica del Texto y Emoji 🛑
    // Deben reflejar lo que la clase CSS REALMENTE está aplicando.
    // Si isDarkMode es TRUE, se está aplicando 'light-mode', por lo tanto, mostramos el sol.
    const emoji = isDarkMode ? '🌞' : '🌙'; 

    return (
        <div 
            className="claro-oscuro-widget" 
            style={styles.container}
        >
            <p className="emoji" style={styles.emoji}>{emoji}</p>
            <p className="text" style={styles.text}>
                {/* Texto invertido para reflejar lo que la clase está haciendo: */}
                {isDarkMode ? 'Modo Claro Activado' : 'Modo Oscuro Activado'} 
            </p>
            
            <button 
                onClick={toggleTheme}
                className="theme-button"
                style={styles.button}
                // Texto del botón invertido:
                aria-label={`Cambiar a modo ${isDarkMode ? 'oscuro' : 'claro'}`}
            >
                {isDarkMode ? 'Cambiar a Oscuro' : 'Cambiar a Claro'}
            </button>
        </div>
    );
}

// Estilos usando objetos JavaScript para CSS en línea (No cambian)
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        borderRadius: '10px', 
        backgroundColor: 'var(--card-background)',
        border: '1px solid var(--border-color)'
    },
    emoji: {
        fontSize: '40px',
        marginBottom: '5px',
        margin: 0,
        color: 'var(--text-color)'
    },
    text: {
        fontSize: '16px',
        marginBottom: '10px',
        fontWeight: '600',
        margin: 0,
        color: 'var(--text-color)'
    },
    button: {
        // Los estilos específicos del botón se manejan en el CSS
    }
};

export default ClaroOscuro;