import './App.css'

const features = [
  ['⌁', 'Crop health diagnosis', 'Upload a crop image and get an AI-assisted disease signal, treatment context, and prevention guidance.', '/diagnosis'],
  ['☼', 'Weather intelligence', 'See conditions, forecasts, and agricultural alerts that help plan watering, planting, and harvest timing.', '/weather'],
  ['◒', 'Farm analytics', 'Understand crop progress, sustainability signals, and operational trends through a single dashboard.', '/analytics'],
  ['↗', 'Market signals', 'Track prices and trends across markets to make more informed decisions about when and where to sell.', '/marketplace'],
  ['▦', 'Crop calendar', 'Keep sowing, watering, fertilizing, and harvest activities visible with seasonal reminders.', '/dashboard'],
  ['♧', 'Farmer community', 'Share practical knowledge, connect with experts, and make better decisions together.', '/community'],
]

export default function App() {
  return (
    <div className="agro-shell">
      <header className="agro-hero">
        <nav className="agro-nav">
          <div className="agro-brand"><span className="agro-brand-mark">✦</span> AgroMind</div>
          <div className="agro-nav-links"><a href="#features">Capabilities</a><a href="#how-it-works">How it works</a><a href="https://github.com/ashikbro/AgroMind">View source ↗</a></div>
        </nav>
        <div className="agro-hero-content">
          <span className="agro-eyebrow">AI-assisted agriculture</span>
          <h1>Better decisions for <em>healthier farms.</em></h1>
          <p>AgroMind brings crop health, weather intelligence, farm analytics, and market signals into one calm workspace for modern farmers.</p>
          <div className="agro-actions"><a className="agro-button primary" href="#features">Explore the platform ↓</a><a className="agro-button secondary" href="https://github.com/ashikbro/AgroMind">Read the project ↗</a></div>
        </div>
      </header>
      <main className="agro-content">
        <section className="agro-stats" aria-label="Platform highlights">
          <div className="agro-stat"><strong>12+</strong><span>Supported languages</span></div>
          <div className="agro-stat"><strong>24/7</strong><span>Farm monitoring mindset</span></div>
          <div className="agro-stat"><strong>4</strong><span>Decision areas connected</span></div>
          <div className="agro-stat"><strong>1</strong><span>Farmer-first workspace</span></div>
        </section>
        <section id="features">
          <div className="agro-section-heading"><div><span className="agro-eyebrow">One connected view</span><h2>Everything your farm needs to move forward.</h2><p>Designed to turn scattered signals into practical next steps.</p></div><small>Built for clarity, not complexity</small></div>
          <div className="agro-feature-grid">{features.map(([icon, title, description, href]) => <article className="agro-feature" key={title}><div className="agro-feature-icon">{icon}</div><h3>{title}</h3><p>{description}</p><a className="agro-link" href={href}>Explore capability →</a></article>)}</div>
        </section>
        <section id="how-it-works">
          <div className="agro-section-heading"><div><span className="agro-eyebrow">A thoughtful foundation</span><h2>Technology that respects the farmer.</h2></div></div>
          <div className="agro-notice"><div><h3>Start with a signal. End with a decision.</h3><p>AgroMind is an assistant, not a replacement for local expertise. Review recommendations against field conditions and trusted professionals.</p></div><a className="agro-button primary" href="https://github.com/ashikbro/AgroMind">See implementation ↗</a></div>
        </section>
      </main>
      <footer className="agro-footer">AgroMind · AI-powered agricultural decision support · Demo showcase</footer>
    </div>
  )
}
