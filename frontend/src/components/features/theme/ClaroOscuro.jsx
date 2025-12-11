import { useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import './ClaroOscuro.css';

function ClaroOscuro() {
    // Obtener el contexto del tema global
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);

    // Emoji y texto que refleja el tema actual
    const emoji = isDarkMode ? '🌙' : '🌞'; 
    const themeText = isDarkMode ? 'Modo Oscuro Activado' : 'Modo Claro Activado';
    const buttonText = isDarkMode ? 'Cambiar a Claro' : 'Cambiar a Oscuro';

    return (
        <div 
            className="claro-oscuro-widget" 
            style={styles.container}
        >
            <p className="emoji" style={styles.emoji}>{emoji}</p>
            <p className="text" style={styles.text}>
                {themeText}
            </p>
            
            <button 
                onClick={toggleTheme}
                className="theme-button"
                style={styles.button}
                aria-label={`Cambiar a modo ${isDarkMode ? 'claro' : 'oscuro'}`}
            >
                {buttonText}
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
        backgroundColor: 'var(--card-background)',
        border: '1px solid var(--border-color)',
        transition: 'background-color 0.3s ease, border-color 0.3s ease'
    },
    emoji: {
        fontSize: '40px',
        marginBottom: '5px',
        margin: 0,
    },
    text: {
        fontSize: '16px',
        marginBottom: '10px',
        fontWeight: '600',
        margin: 0,
        color: 'var(--text-color)',
    },
    button: {
        padding: '8px 15px', 
        fontSize: '14px', 
        cursor: 'pointer',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: 'var(--button-primary)',
        color: 'var(--button-text)',
        marginTop: '10px',
        transition: 'background-color 0.2s ease, opacity 0.2s ease',
    }
};

export default ClaroOscuro;