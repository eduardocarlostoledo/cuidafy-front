import { Link } from "react-router-dom";

export const RHEUMAZIN_WHATSAPP_URL =
  "https://wa.me/543764331313?text=" +
  encodeURIComponent("Vengo desde la pagina de rheumazin forte necesito mas informacion");

const RheumazinLegalLayout = ({ title, lastUpdate, children }) => {
  return (
    <div className="rl-page">
      <style>{styles}</style>

      <header className="rl-header">
        <div className="rl-header__inner">
          <Link to="/rheumazin-forte" className="rl-logo">
            <span className="rl-logo__mark">C</span>
            <span className="rl-logo__text">Cuidafy</span>
          </Link>
          <Link to="/rheumazin-forte" className="rl-back">
            ← Volver a la tienda
          </Link>
        </div>
      </header>

      <main className="rl-main">
        <div className="rl-container">
          <p className="rl-breadcrumb">
            <Link to="/rheumazin-forte">Rheumatizin Forte</Link>
            <span> / </span>
            <span>{title}</span>
          </p>
          <h1 className="rl-title">{title}</h1>
          {lastUpdate ? (
            <p className="rl-meta">Última actualización: {lastUpdate}</p>
          ) : null}
          <article className="rl-content">{children}</article>

          <div className="rl-help">
            <p className="rl-help__text">
              ¿Tenés una consulta que no está acá? Escribinos por WhatsApp y te respondemos
              personalmente.
            </p>
            <a
              href={RHEUMAZIN_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rl-help__btn"
            >
              <WhatsappIcon /> Escribir por WhatsApp
            </a>
          </div>
        </div>
      </main>

      <footer className="rl-footer">
        <div className="rl-container rl-footer__inner">
          <div className="rl-logo rl-logo--light">
            <span className="rl-logo__mark">C</span>
            <span className="rl-logo__text">Cuidafy</span>
          </div>
          <nav className="rl-footer__nav">
            <Link to="/rheumazin-forte">Rheumatizin Forte</Link>
            <Link to="/terminos-rheumazin">Términos y condiciones</Link>
            <Link to="/privacidad-rheumazin">Política de privacidad</Link>
            <Link to="/devoluciones-rheumazin">Cambios y devoluciones</Link>
          </nav>
          <p className="rl-footer__copy">
            © {new Date().getFullYear()} Cuidafy — cuidafy.com.ar
          </p>
        </div>
      </footer>

      <a
        href={RHEUMAZIN_WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="rl-wa-float"
        aria-label="Abrir WhatsApp"
      >
        <WhatsappIcon />
      </a>
    </div>
  );
};

export const WhatsappIcon = ({ size = 22 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const styles = `
.rl-page {
  --rl-blue: #1a56db;
  --rl-blue-dark: #1e3a8a;
  --rl-blue-soft: #eff6ff;
  --rl-green: #25d366;
  --rl-green-dark: #128c7e;
  --rl-text: #1f2937;
  --rl-muted: #4b5563;
  --rl-border: #e5e7eb;
  --rl-bg-soft: #f8fafc;
  font-family: 'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--rl-text);
  background: #fff;
  line-height: 1.7;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  -webkit-font-smoothing: antialiased;
}
.rl-page *, .rl-page *::before, .rl-page *::after { box-sizing: border-box; }
.rl-page a { color: var(--rl-blue); text-decoration: none; }
.rl-page a:hover { text-decoration: underline; }
.rl-page h1, .rl-page h2, .rl-page h3 { color: #0f172a; margin: 0; line-height: 1.25; font-weight: 800; }

.rl-container { max-width: 760px; margin: 0 auto; padding: 0 20px; }

.rl-header { position: sticky; top: 0; z-index: 40; background: rgba(255,255,255,0.96); backdrop-filter: blur(8px); border-bottom: 1px solid var(--rl-border); }
.rl-header__inner { max-width: 1120px; margin: 0 auto; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.rl-back { font-size: 14px; font-weight: 600; color: var(--rl-blue-dark); }

.rl-logo { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 20px; color: var(--rl-blue-dark); }
.rl-logo:hover { text-decoration: none; }
.rl-logo__mark { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, var(--rl-blue), var(--rl-blue-dark)); color: #fff; display: grid; place-items: center; font-size: 20px; font-weight: 900; }
.rl-logo--light { color: #fff; }

.rl-main { flex: 1; padding: 48px 20px 64px; }
.rl-breadcrumb { font-size: 13px; color: var(--rl-muted); margin: 0 0 16px; }
.rl-breadcrumb a { color: var(--rl-blue); }
.rl-title { font-size: clamp(28px, 4.5vw, 40px); margin-bottom: 8px; }
.rl-meta { color: var(--rl-muted); font-size: 14px; margin: 0 0 28px; }

.rl-content { font-size: 16px; color: var(--rl-text); }
.rl-content h2 { font-size: 22px; color: var(--rl-blue-dark); margin: 36px 0 12px; }
.rl-content h3 { font-size: 18px; color: var(--rl-text); margin: 24px 0 10px; }
.rl-content p { margin: 0 0 16px; }
.rl-content ul, .rl-content ol { margin: 0 0 18px 22px; padding: 0; }
.rl-content li { margin-bottom: 8px; }
.rl-content strong { color: var(--rl-blue-dark); }

.rl-help { margin-top: 56px; padding: 28px 24px; background: var(--rl-blue-soft); border: 1px solid #dbeafe; border-radius: 18px; display: grid; gap: 16px; }
.rl-help__text { margin: 0; font-size: 15px; color: var(--rl-text); }
.rl-help__btn { display: inline-flex; align-items: center; gap: 10px; background: var(--rl-green); color: #fff !important; font-weight: 700; padding: 12px 22px; border-radius: 999px; text-decoration: none !important; width: max-content; box-shadow: 0 10px 24px rgba(37,211,102,0.32); transition: transform 0.15s ease, background 0.15s ease; }
.rl-help__btn:hover { background: var(--rl-green-dark); transform: translateY(-2px); }

.rl-footer { background: #0f172a; color: #cbd5e1; padding: 40px 20px 32px; }
.rl-footer__inner { display: grid; gap: 18px; text-align: center; align-items: center; }
.rl-footer__inner .rl-logo { justify-content: center; color: #fff; }
.rl-footer__nav { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; font-size: 14px; }
.rl-footer__nav a { color: #cbd5e1; }
.rl-footer__nav a:hover { color: #fff; }
.rl-footer__copy { font-size: 12px; color: #64748b; margin: 0; }

.rl-wa-float { position: fixed; bottom: 24px; right: 24px; z-index: 80; width: 58px; height: 58px; border-radius: 50%; background: var(--rl-green); color: #fff !important; display: flex; align-items: center; justify-content: center; box-shadow: 0 18px 38px rgba(37,211,102,0.45); transition: transform 0.15s ease, background 0.15s ease; }
.rl-wa-float:hover { background: var(--rl-green-dark); transform: translateY(-3px); text-decoration: none !important; }

@media (min-width: 768px) {
  .rl-footer__inner { grid-template-columns: auto 1fr auto; text-align: left; }
  .rl-footer__inner .rl-logo { justify-content: flex-start; }
  .rl-footer__copy { text-align: right; }
}
`;

export default RheumazinLegalLayout;
