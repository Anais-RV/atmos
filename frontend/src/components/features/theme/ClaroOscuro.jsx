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

    // 🛑 Inicialización Directa (isDarkMode = true si el sistema es oscuro) 🛑
    const [isDarkMode, setIsDarkMode] = useState(systemScheme === 'dark'); 
    
    // Función para alternar el estado
    const toggleTheme = () => setIsDarkMode(prev => !prev);

    // 🛑 Lógica Invertida en useEffect (Arregla el fondo invertido) 🛑
    useEffect(() => {
        document.body.classList.remove('light-mode', 'dark-mode'); 
        
        // INVERSIÓN: Si isDarkMode es TRUE, se aplica 'light-mode' (claro visual)
        const modeClass = isDarkMode ? 'light-mode' : 'dark-mode'; 
        
        document.body.classList.add(modeClass);
    }, [isDarkMode]);

    // 🛑 Inversión en el Texto y Emoji (Refleja el tema visual) 🛑
    // Si isDarkMode es TRUE, el tema VISUAL es CLARO, por eso mostramos el Sol.
    const emoji = isDarkMode ? '🌞' : '🌙'; 

    return (
        <div 
            className="claro-oscuro-widget" 
            style={styles.container}
        >
            {/* Texto y emoji ahora HEREDAN el color del contenedor (CSS) */}
            <p className="emoji" style={styles.emoji}>{emoji}</p>
            <p className="text" style={styles.text}>
                {/* Texto reflejando el tema visual actual */}
                {isDarkMode ? 'Modo Claro Activado' : 'Modo Oscuro Activado'} 
            </p>
            
            <button 
                onClick={toggleTheme}
                className="theme-button"
                style={styles.button}
                // Texto del botón:
                aria-label={`Cambiar a modo ${isDarkMode ? 'oscuro' : 'claro'}`}
            >
                {isDarkMode ? 'Cambiar a Oscuro' : 'Cambiar a Claro'}
            </button>
        </div>
    );
}

// Estilos usando objetos JavaScript para CSS en línea
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        borderRadius: '10px', 
        backgroundColor: 'var(--card-background)', // Fondo de la tarjeta
        border: '1px solid var(--border-color)'
    },
    emoji: {
        fontSize: '40px',
        marginBottom: '5px',
        margin: 0,
        // 🛑 CORRECCIÓN: ELIMINAR PROPIEDAD 'color' AQUÍ para que herede del CSS.
    },
    text: {
        fontSize: '16px',
        marginBottom: '10px',
        fontWeight: '600',
        margin: 0,
        // 🛑 CORRECCIÓN: ELIMINAR PROPIEDAD 'color' AQUÍ para que herede del CSS.
    },
    button: {
        // Los estilos específicos del botón se manejan en el CSS
    }
};

export default ClaroOscuro;