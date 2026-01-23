import { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [temperatureC, setTemperatureC] = useState(15);

    // Efecto para cambiar el fondo dinámicamente según la ciudad de forma global
    useEffect(() => {
        if (selectedCity && selectedCity.id) {
            const cityImages = {
                1: '/images/cities/madrid.jpg',       // Madrid
                2: '/images/cities/barcelona.jpg',    // Barcelona
                14: '/images/cities/gijon.jpg',       // Gijón
                52: '/images/cities/oviedo.jpg'       // Oviedo
            };

            const bgImage = cityImages[selectedCity.id] || '/images/cities/default.jpg';
            document.body.style.backgroundImage = `url('${bgImage}')`;
            document.body.style.transition = 'background-image 0.5s ease-in-out';
        } else {
            // Fondo por defecto
            document.body.style.backgroundImage = "url('/background.png')";
        }
    }, [selectedCity]);

    const value = {
        selectedCity,
        setSelectedCity,
        temperatureC,
        setTemperatureC
    };

    return (
        <WeatherContext.Provider value={value}>
            {children}
        </WeatherContext.Provider>
    );
};

WeatherProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useWeather = () => {
    const context = useContext(WeatherContext);
    if (!context) {
        throw new Error('useWeather must be used within a WeatherProvider');
    }
    return context;
};
