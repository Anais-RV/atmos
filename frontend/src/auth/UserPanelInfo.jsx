// frontend/src/components/auth/UserPanelInfo.jsx

function UserPanelInfo() {
  // TODO: replace with real user data from backend / context
  const user = {
    name: "SuperKode",
    email: "SomosLaHostia@SuperKode.es",
    location: "Madrid, ES",
  };

  return (
    <div className="auth-user-panel">
      <div className="auth-user-header">
        <div className="auth-user-avatar">
          {user.name.charAt(0)}
        </div>
        <div>
          <h2 className="auth-user-name">{user.name}</h2>
          <p className="auth-user-email">{user.email}</p>
        </div>
      </div>


      <div className="auth-user-actions">
        <button className="auth-button-secondary">
          Sign out
        </button>
      </div>
    </div>
  );
}

export default UserPanelInfo;
