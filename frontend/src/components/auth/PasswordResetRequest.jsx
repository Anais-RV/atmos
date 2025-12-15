import { useState } from "react";
import { Link } from "react-router-dom";

function PasswordResetRequest() {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [isError, setIsError] = useState(false);
	const [loading, setLoading] = useState(false);

	const validateEmail = (value) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage("");
		setIsError(false);

		if (!validateEmail(email)) {
			setIsError(true);
			setMessage("Por favor ingresa un correo electrónico válido.");
			return;
		}

		setLoading(true);
		try {
			const res = await fetch("/api/password-reset/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			if (res.ok) {
				setIsError(false);
				setMessage("Revisa tu correo electrónico para el enlace de recuperación.");
				setEmail("");
			} else {
				// intentar leer posible mensaje de error del backend
				let text = "El correo no está registrado o hubo un error.";
				try {
					const data = await res.json();
					if (data && data.detail) text = data.detail;
					else if (data && data.email) text = Array.isArray(data.email) ? data.email.join(" ") : data.email;
				} catch (err) {
					// ignore JSON parse error
				}
				setIsError(true);
				setMessage(text);
			}
		} catch (err) {
			setIsError(true);
			setMessage("No se pudo enviar la solicitud. Intenta nuevamente más tarde.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form className="auth-form" onSubmit={handleSubmit} aria-labelledby="password-reset-title">
			<h3 id="password-reset-title">Recuperar contraseña</h3>

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
				<button type="submit" className="auth-button-primary" disabled={loading}>
					{loading ? "Enviando..." : "Enviar link de recuperación"}
				</button>
				<p className="auth-footer-text">
					<Link to="/login" className="auth-link">Volver al inicio de sesión</Link>
				</p>
			</div>

			{message && (
				<p className={isError ? "auth-error" : "auth-success"} role="status">
					{message}
				</p>
			)}
		</form>
	);
}

export default PasswordResetRequest;
