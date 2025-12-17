import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

function PasswordResetRequest() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const messageRef = useRef(null);
    const abortControllerRef = useRef(null);

    const validateEmail = (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsError(false);

        const trimmed = email.trim().toLowerCase();

        if (!validateEmail(trimmed)) {
            setIsError(true);
            setMessage("Por favor ingresa un correo electrónico válido.");
            return;
        }

        // cancelar petición previa si existiera
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        try {
            const res = await fetch(`/api/password-reset/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: trimmed }),
                signal: controller.signal,
            });

            let text = "El correo no está registrado o hubo un error.";
            try {
                const data = await res.json();
                if (data && data.detail) text = data.detail;
                else if (data && data.email) text = Array.isArray(data.email) ? data.email.join(" ") : data.email;
            } catch (err) {
                // no JSON body
            }

            if (res.ok) {
                setIsError(false);
                setMessage("✅ Contraseña temporal enviada a tu correo. Revisa tu bandeja de entrada.");
                setEmail("");
            } else {
                setIsError(true);
                setMessage(text);
            }
        } catch (err) {
            if (err.name === 'AbortError') return;
            setIsError(true);
            setMessage("No se pudo enviar la solicitud. Intenta nuevamente más tarde.");
        } finally {
            setLoading(false);
            abortControllerRef.current = null;
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit} aria-labelledby="password-reset-title" aria-busy={loading}>
            <h3 id="password-reset-title">Recuperar contraseña</h3>
            <p className="auth-subtitle">Ingresa tu correo y recibirás una contraseña temporal</p>

            <div className="auth-field">
                <label htmlFor="password-reset-email" className="auth-label">Correo electrónico</label>
                <input
                    id="password-reset-email"
                    type="email"
                    className="auth-input"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-required="true"
                />
            </div>

            <div className="auth-form-footer">
                <button
                    type="submit"
                    className="auth-button-primary"
                    disabled={loading || !validateEmail(email.trim())}
                    aria-disabled={loading || !validateEmail(email.trim())}
                >
                    {loading ? "Enviando..." : "Enviar contraseña temporal"}
                </button>
                <p className="auth-footer-text">
                    <Link to="/auth" className="auth-link">Volver al inicio de sesión</Link>
                </p>
            </div>

            {message && (
                <p
                    id="password-reset-msg"
                    ref={messageRef}
                    className={isError ? "auth-error" : "auth-success"}
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {message}
                </p>
            )}
        </form>
    );
}

export default PasswordResetRequest;