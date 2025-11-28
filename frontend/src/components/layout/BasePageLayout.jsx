// frontend/src/components/layout/BasePageLayout.jsx

function BasePageLayout({ title, description, children }) {
  return (
    <main className="app-main">
      <section className="dashboard">
        <header className="dashboard-header">
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </header>

        <section className="dashboard-center">
          {children}
        </section>
      </section>
    </main>
  );
}

export default BasePageLayout;
