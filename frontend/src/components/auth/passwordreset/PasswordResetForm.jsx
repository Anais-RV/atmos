import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function PasswordResetForm() {
	const [email, setEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState("");
	const [isError, setIsError] = useState(false);
	const [loading, setLoading] = useState(false);

	const validateEmail = (value) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
	};

	const validatePassword = (value) => {
		return value.length >= 6;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage("");
		setIsError(false);

		// Validaciones
		if (!validateEmail(email)) {
			setIsError(true);
			setMessage("Por favor ingresa un correo electrónico válido.");
			return;
		}

		if (!validatePassword(newPassword)) {
			setIsError(true);
			setMessage("La contraseña debe tener al menos 6 caracteres.");
			return;
		}

		if (newPassword !== confirmPassword) {
			setIsError(true);
			setMessage("Las contraseñas no coinciden.");
			return;
		}

		setLoading(true);
		try {
			const res = await fetch("/api/auth/password-reset/confirm/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					uid,
					token,
					new_password: newPassword,
					confirm_password: confirmPassword,
				}),
			});

			if (res.ok) {
				setIsError(false);
				setMessage("¡Contraseña restablecida exitosamente! Puedes iniciar sesión con tu nueva contraseña.");
				setEmail("");
				setNewPassword("");
				setConfirmPassword("");
			} else {
				let text = "Hubo un error al restablecer la contraseña.";
				try {
					const data = await res.json();
					if (data && data.detail) text = data.detail;
					else if (data && data.email) text = Array.isArray(data.email) ? data.email.join(" ") : data.email;
					else if (data && data.new_password) text = Array.isArray(data.new_password) ? data.new_password.join(" ") : data.new_password;
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

	// read uid and token from querystring
	const location = useLocation();
	const [uid, setUid] = useState("");
	const [token, setToken] = useState("");

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const u = params.get('uid') || '';
		const t = params.get('token') || '';
		setUid(u);
		setToken(t);
	}, [location.search]);

	return (
		<form className="auth-form" onSubmit={handleSubmit} aria-labelledby="password-reset-form-title">
			<h3 id="password-reset-form-title">Restablecer contraseña</h3>

			<div className="auth-field">
				<label htmlFor="reset-email" className="auth-label">
					Correo electrónico
				</label>
				<input
					id="reset-email"
					type="email"
					className="auth-input"
					placeholder="tu@correo.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					aria-required="true"
				/>
			</div>

			<div className="auth-field">
				<label htmlFor="new-password" className="auth-label">
					Nueva contraseña
				</label>
				<input
					id="new-password"
					type="password"
					className="auth-input"
					placeholder="Mínimo 6 caracteres"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
					required
					minLength="6"
					aria-required="true"
				/>
			</div>

			<div className="auth-field">
				<label htmlFor="confirm-password" className="auth-label">
					Confirmar contraseña
				</label>
				<input
					id="confirm-password"
					type="password"
					className="auth-input"
					placeholder="Repite tu nueva contraseña"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
					minLength="6"
					aria-required="true"
				/>
			</div>

			<div className="auth-form-footer">
				<button type="submit" className="auth-button-primary" disabled={loading}>
					{loading ? "Procesando..." : "Restablecer contraseña"}
				</button>
				<p className="auth-footer-text">
					<Link to="/login" className="auth-link">
						Volver al inicio de sesión
					</Link>
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

export default PasswordResetForm;
