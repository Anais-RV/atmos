import React, { createContext, useState, useContext, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
    const [highContrast, setHighContrast] = useState(() => {
        return localStorage.getItem('accessibility-high-contrast') === 'true';
    });
    const [textNarration, setTextNarration] = useState(() => {
        return localStorage.getItem('accessibility-text-narration') === 'true';
    });
    const [simplifiedMode, setSimplifiedMode] = useState(() => {
        return localStorage.getItem('accessibility-simplified-mode') === 'true';
    });

    useEffect(() => {
        localStorage.setItem('accessibility-high-contrast', highContrast);
        if (highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }, [highContrast]);

    useEffect(() => {
        localStorage.setItem('accessibility-text-narration', textNarration);
    }, [textNarration]);

    useEffect(() => {
        localStorage.setItem('accessibility-simplified-mode', simplifiedMode);
        if (simplifiedMode) {
            document.body.classList.add('simplified-mode');
        } else {
            document.body.classList.remove('simplified-mode');
        }
    }, [simplifiedMode]);

    const toggleHighContrast = () => setHighContrast(prev => !prev);
    const toggleTextNarration = () => setTextNarration(prev => !prev);
    const toggleSimplifiedMode = () => setSimplifiedMode(prev => !prev);

    return (
        <AccessibilityContext.Provider value={{
            highContrast,
            textNarration,
            simplifiedMode,
            toggleHighContrast,
            toggleTextNarration,
            toggleSimplifiedMode
        }}>
            {children}
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
};
