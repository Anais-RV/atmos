import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/useLanguage";

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
	const { t } = useLanguage();

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
				setMessage(t('auth.validEmail'));
				return;
			}
		}

		if (!validatePassword(newPassword)) {
			setIsError(true);
			setMessage(t('auth.minimumCharacters'));
			return;
		}

		if (newPassword !== confirmPassword) {
			setIsError(true);
			setMessage(t('auth.passwordMismatch'));
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
				setMessage(t('auth.resetSuccess'));
				setEmail("");
				setNewPassword("");
				setConfirmPassword("");
				setManualToken("");
				setTimeout(() => navigate('/login'), 1600);
			} else {
				let text = t('auth.resetError');
				try {
					const data = await res.json();
					if (data && data.detail) text = data.detail;
					else if (data && data.email) text = Array.isArray(data.email) ? data.email.join(" ") : data.email;
					else if (data && data.new_password) text = Array.isArray(data.new_password) ? data.new_password.join(" ") : data.new_password;
					else if (data && data.new_password_confirm) text = Array.isArray(data.new_password_confirm) ? data.new_password_confirm.join(" ") : data.new_password_confirm;
					else if (data && data.token) text = Array.isArray(data.token) ? data.token.join(" ") : data.token;
				} catch {
					// ignore JSON parse error
				}
				setIsError(true);
				setMessage(text);
			}
		} catch {
			setIsError(true);
			setMessage(t('auth.requestFailed'));
		} finally {
			setLoading(false);
		}
	};

	return (
		<form className="auth-form" onSubmit={handleSubmit} aria-labelledby="password-reset-form-title">
			<h3 id="password-reset-form-title">{t('auth.resetFormTitle')}</h3>

			{paramToken ? (
				<div className="auth-field">
					<label className="auth-label">{t('auth.tokenFromUrl')}</label>
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
							{t('auth.email')}
						</label>
						<input
							id="reset-email"
							type="email"
							className="auth-input"
							placeholder={t('auth.emailPlaceholder')}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							aria-required="true"
						/>
					</div>

					<div className="auth-field">
						<label htmlFor="manual-token" className="auth-label">
							{t('auth.tokenFromUrl')} {t('auth.optional')}
						</label>
						<input
							id="manual-token"
							type="text"
							className="auth-input"
							placeholder={t('auth.pasteToken')}
							value={manualToken}
							onChange={(e) => setManualToken(e.target.value)}
						/>
					</div>
				</>
			)}

			<div className="auth-field">
				<label htmlFor="new-password" className="auth-label">
					{t('auth.newPassword')}
				</label>
				<input
					id="new-password"
					type="password"
					className="auth-input"
					placeholder={t('auth.minimumCharacters')}
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
					required
					minLength="6"
					aria-required="true"
				/>
			</div>

			<div className="auth-field">
				<label htmlFor="confirm-password" className="auth-label">
					{t('auth.confirmNewPassword')}
				</label>
				<input
					id="confirm-password"
					type="password"
					className="auth-input"
					placeholder={t('auth.repeatPassword')}
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
					minLength="6"
					aria-required="true"
				/>
			</div>

			<div className="auth-form-footer">
				<button type="submit" className="auth-button-primary" disabled={loading}>
					{loading ? t('auth.processing') : t('auth.resetPassword')}
				</button>
				<p className="auth-footer-text">
					<Link to="/login" className="auth-link">
						{t('auth.backToLogin')}
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
