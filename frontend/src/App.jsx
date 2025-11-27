export default function App() {
  return (
    <div style={{ 
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#1a1a1a",
      color: "#fff",
      fontFamily: "monospace",
      padding: "2rem"
    }}>
      
      {/* Video de fondo estilo meme */}
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: "800px",
        marginBottom: "2rem",
        border: "3px solid #ff6b35",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 0 20px rgba(255, 107, 53, 0.5)"
      }}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          style={{ width: "100%", display: "block" }}
        >
          <source src="/chaos.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay con texto estilo meme */}
        <div style={{
          position: "absolute",
          bottom: "20px",
          left: "0",
          right: "0",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: "1rem",
          borderTop: "2px solid #ff6b35"
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: "1.2rem", 
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "2px"
          }}>
            This is fine. 🔥
          </p>
        </div>
      </div>

      {/* Mensaje de bienvenida */}
      <div style={{ textAlign: "center", maxWidth: "600px" }}>
        <h1 style={{ 
          fontSize: "2.5rem", 
          marginBottom: "1rem",
          color: "#ff6b35"
        }}>
          🔥 Bienvenid@s a Atmos 🔥
        </h1>
        
        <p style={{ 
          fontSize: "1.2rem", 
          marginBottom: "0.5rem",
          lineHeight: "1.6"
        }}>
          <strong>Proyecto Fullstack de Estación Meteorológica</strong>
        </p>
        
        <p style={{ 
          fontSize: "1rem", 
          opacity: 0.8,
          marginBottom: "2rem",
          fontStyle: "italic"
        }}>
          Donde los bugs arden pero el código sigue adelante
        </p>

        <div style={{
          backgroundColor: "#2a2a2a",
          padding: "1.5rem",
          borderRadius: "8px",
          border: "2px solid #ff6b35"
        }}>
          <p style={{ margin: "0.5rem 0" }}>
            ☕ <strong>Regla #1:</strong> Si algo prende fuego, ve a por café.
          </p>
          <p style={{ margin: "0.5rem 0" }}>
            🔥 <strong>Regla #2:</strong> Si no prende fuego... haz commit.
          </p>
          <p style={{ margin: "0.5rem 0" }}>
            🚀 <strong>Regla #3:</strong> Todo está bajo control o no, ¡Da igual, hay café!
          </p>
        </div>

        <p style={{ 
          marginTop: "2rem", 
          fontSize: "0.9rem", 
          opacity: 0.6 
        }}>
          ~ Mamá Pato supervisa el caos desde su nido de llamas, con café, mucho café. ~
        </p>
      </div>
    </div>
  )
}
