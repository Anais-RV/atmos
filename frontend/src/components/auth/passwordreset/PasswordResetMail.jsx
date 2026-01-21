import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../context/useLanguage";
import apiClient from "../../../services/apiClient";

function PasswordResetRequest() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const messageRef = useRef(null);
    const abortControllerRef = useRef(null);
    const { t } = useLanguage();

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
            setMessage(t('auth.validEmail'));
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
            const data = await apiClient('/api/auth/password-reset/request/', {
                method: "POST",
                body: { email: trimmed },
                signal: controller.signal,
            });

            // Success case
            setIsError(false);
            // If backend returns the token (for testing/dev), show link
            if (data && data.token) {
                setMessage(
                    t('auth.passwordSent') + " " +
                    window.location.origin + "/password-reset/" + data.token
                );
                setEmail("");
            } else {
                setMessage(t('auth.passwordSent'));
                setEmail("");
            }
        } catch (err) {
            if (err.name === 'AbortError') return;
            setIsError(true);
            setMessage(err.message || t('common.error'));
        } finally {
            setLoading(false);
            abortControllerRef.current = null;
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit} aria-labelledby="password-reset-title" aria-busy={loading}>
            <h3 id="password-reset-title">{t('auth.passwordReset')}</h3>
            <p className="auth-subtitle">{t('auth.passwordResetSubtitle')}</p>

            <div className="auth-field">
                <label htmlFor="password-reset-email" className="auth-label">{t('auth.email')}</label>
                <input
                    id="password-reset-email"
                    type="email"
                    className="auth-input"
                    placeholder={t('auth.emailPlaceholder')}
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
                    {loading ? t('auth.sending') : t('auth.sendTemporaryPassword')}
                </button>
                <p className="auth-footer-text">
                    <Link to="/auth" className="auth-link">{t('auth.backToLogin')}</Link>
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