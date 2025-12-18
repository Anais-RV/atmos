import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

function PasswordResetForm() {
	const [email, setEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [manualToken, setManualToken] = useState("");
	const [message, setMessage] = useState("");
	const [isError, setIsError] = useState(false);
	const [loading, setLoading] = useState(false);

	const { token: paramToken } = useParams();
	const navigate = useNavigate();

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
		const tokenToSend = paramToken || manualToken;

		if (!tokenToSend) {
			// if no token in URL, require email (user may be using direct form)
			if (!validateEmail(email)) {
				setIsError(true);
				setMessage("Por favor ingresa un correo electrónico válido o pega el token.");
				return;
			}
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
			const body = {
				new_password: newPassword,
				new_password_confirm: confirmPassword,
			};

			if (paramToken || manualToken) body.token = tokenToSend;
			else body.email = email.trim().toLowerCase();

			const res = await fetch("http://localhost:8000/api/auth/password-reset/confirm/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (res.ok) {
				setIsError(false);
				setMessage("¡Contraseña restablecida exitosamente! Serás redirigido al inicio de sesión.");
				setEmail("");
				setNewPassword("");
				setConfirmPassword("");
				setManualToken("");
				setTimeout(() => navigate('/login'), 1600);
			} else {
				let text = "Hubo un error al restablecer la contraseña.";
				try {
					const data = await res.json();
					if (data && data.detail) text = data.detail;
					else if (data && data.email) text = Array.isArray(data.email) ? data.email.join(" ") : data.email;
					else if (data && data.new_password) text = Array.isArray(data.new_password) ? data.new_password.join(" ") : data.new_password;
					else if (data && data.new_password_confirm) text = Array.isArray(data.new_password_confirm) ? data.new_password_confirm.join(" ") : data.new_password_confirm;
					else if (data && data.token) text = Array.isArray(data.token) ? data.token.join(" ") : data.token;
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
		<form className="auth-form" onSubmit={handleSubmit} aria-labelledby="password-reset-form-title">
			<h3 id="password-reset-form-title">Restablecer contraseña</h3>

			{paramToken ? (
				<div className="auth-field">
					<label className="auth-label">Token (desde la URL)</label>
					<input
						className="auth-input"
						type="text"
						value={paramToken}
						readOnly
						aria-readonly="true"
					/>
				</div>
			) : (
				<>
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
							aria-required="true"
						/>
					</div>

					<div className="auth-field">
						<label htmlFor="manual-token" className="auth-label">
							Token (opcional)
						</label>
						<input
							id="manual-token"
							type="text"
							className="auth-input"
							placeholder="Pega aquí el token si lo tienes"
							value={manualToken}
							onChange={(e) => setManualToken(e.target.value)}
						/>
					</div>
				</>
			)}

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
