import  { useState, useEffect } from 'react';

import './ClaroOscuro.css';

// NOTA: En React DOM, ya no usamos 'View', 'Text', 'StyleSheet', 'Switch'
// y reemplazamos 'useColorScheme' por el chequeo directo del navegador.

// 1. Hook para obtener el esquema de color del sistema (Web Equivalent)
// Es una buena práctica crear un hook para esta lógica.
const useWebColorScheme = () => {
    // Retorna 'dark', 'light' o null si el ambiente no lo soporta
    if (typeof window === 'undefined' || !window.matchMedia) {
        return null;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

function ClaroOscuro() {
    // Lógica del tema del sistema (equivalente a useColorScheme de RN)
    const systemScheme = useWebColorScheme();

    // Inicializamos el estado: si el sistema es oscuro, comienza como oscuro.
    // Usamos 'false' como fallback si el sistemaScheme es null.
    const [isDarkMode, setIsDarkMode] = useState(systemScheme === 'dark');

    // Función para alternar el estado (al hacer clic en el botón)
    const toggleTheme = () => setIsDarkMode(prev => !prev);

    // useEffect para aplicar la clase CSS al body (Práctica recomendada en Web)
    // Esto es equivalente a cómo se manejan los temas globales en el código original del Context.
    useEffect(() => {
        document.body.classList.remove('light-mode', 'dark-mode'); // Limpiamos clases anteriores
        const modeClass = isDarkMode ? 'dark-mode' : 'light-mode';
        document.body.classList.add(modeClass);
    }, [isDarkMode]);
    // Nota: Necesitarás definir los estilos CSS para estas clases en tu archivo global.

    // Estilos dinámicos para el componente (equivalente a los estilos de React Native)
    const backgroundColor = isDarkMode ? '#121212' : '#f2f2f2';
    const textColor = isDarkMode ? '#ffffff' : '#000000';
    const emoji = isDarkMode ? '🌙' : '🌞';

    // 2. El componente principal (usando elementos HTML en lugar de RN components)
    return (
        // Reemplazamos <View> por <div>
        <div 
            style={{
                ...styles.container, // Estilos base
                backgroundColor,     // Fondo dinámico
            }}
        >
            {/* Reemplazamos <Text> por <p> o <span> */}
            <p style={{ ...styles.emoji, color: textColor }}>{emoji}</p>
            <p style={{ ...styles.text, color: textColor }}>
                {isDarkMode ? 'Modo Oscuro Activado' : 'Modo Claro Activado'}
            </p>
            
            {/* Reemplazamos <Switch> por un botón o un checkbox para simplicidad */}
            <button 
                onClick={toggleTheme}
                style={styles.button}
                aria-label={`Cambiar a modo ${isDarkMode ? 'claro' : 'oscuro'}`}
            >
                {isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            </button>

            {/* Opcional: Usar un Checkbox para simular el Switch */}
            {/* <input 
                type="checkbox" 
                checked={isDarkMode} 
                onChange={toggleTheme} 
            /> */}
        </div>
    );
}

// Estilos usando objetos JavaScript para CSS en línea (equivalente a StyleSheet.create)
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Para que ocupe toda la altura de la vista
        transition: 'background-color 0.3s ease', // Transición suave
        padding: '20px',
    },
    emoji: {
        fontSize: '64px',
        marginBottom: '10px',
        margin: 0, // Eliminar margen por defecto de <p>
    },
    text: {
        fontSize: '20px',
        marginBottom: '20px',
        fontWeight: '600',
        margin: 0, // Eliminar margen por defecto de <p>
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#ffffff',
        marginTop: '10px',
    }
};

export default ClaroOscuro;