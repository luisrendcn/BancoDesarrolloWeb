import { useState, type FormEvent } from 'react'
import { ArrowDownLeft, ArrowRight, ArrowUpRight, Check, Eye, EyeOff, Fingerprint, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { bankApi, type AuthResponse } from '../lib/api'

interface AuthScreenProps {
  onAuthenticated: (session: AuthResponse) => void
}

function EntryArtwork() {
  return (
    <div className="entry-artwork" aria-hidden="true">
      <div className="art-orbit orbit-a" /><div className="art-orbit orbit-b" /><div className="art-orbit orbit-c" />
      <svg className="art-route" viewBox="0 0 500 360" fill="none">
        <path d="M35 260C120 260 112 95 217 123S305 275 382 189 416 107 473 85" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 8" />
        <circle cx="35" cy="260" r="5" fill="currentColor" /><circle cx="217" cy="123" r="6" fill="currentColor" /><circle cx="382" cy="189" r="4" fill="currentColor" /><circle cx="473" cy="85" r="5" fill="currentColor" />
        <path d="m460 79 13 6-2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="art-token token-top"><span className="token-glyph">b.</span><span><strong>Tu espacio</strong><small>personal y privado</small></span><ShieldCheck size={15} /></div>
      <div className="art-token token-bottom"><span className="token-arrow"><ArrowUpRight size={17} /></span><span><strong>El siguiente paso</strong><small>empieza contigo</small></span><span className="token-check"><Check size={12} /></span></div>
      <div className="art-caption"><span>01</span><span>UN ESPACIO PARA LO QUE SIGUE</span></div>
    </div>
  )
}

export default function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      const session = mode === 'login'
        ? await bankApi.login(email, password)
        : await bankApi.register(firstName, lastName, email, password)
      onAuthenticated(session)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No fue posible completar el acceso.')
    } finally {
      setBusy(false)
    }
  }

  function changeMode(nextMode: 'login' | 'register') {
    setMode(nextMode)
    setError('')
  }

  return (
    <main className="entry-page">
      <div className="entry-grain" aria-hidden="true" />
      <header className="entry-header">
        <a className="entry-wordmark" href="/login" aria-label="GoldenBank, inicio"><img className="entry-brand-icon" src="/goldenbank-icon.png" alt="" /><span className="wordmark-name">Golden<span>Bank</span></span></a>
        <span className="entry-header-note"><span className="header-dash" /> FINANZAS, CON PERSPECTIVA</span>
      </header>

      <section className="entry-stage">
        <EntryArtwork />
        <article className="entry-card">
          <div className="entry-card-top"><span className="entry-card-kicker"><Fingerprint size={14} /> ACCESO PERSONAL</span><span className="entry-card-index">01 <i /> 02</span></div>
          <div className="entry-heading">
            <span className="entry-pretitle">{mode === 'login' ? 'QUÉ BUENO TENERTE DE VUELTA' : 'UN BUEN COMIENZO'}</span>
            <h1>{mode === 'login' ? <>Vuelve a tu<br /><em>propio ritmo.</em></> : <>Abre espacio<br /><em>para avanzar.</em></>}</h1>
            <p>{mode === 'login' ? 'Ingresa para continuar donde lo dejaste.' : 'Crea tu acceso personal en unos pasos.'}</p>
          </div>

          <div className="entry-switch" aria-label="Tipo de acceso">
            <button type="button" className={mode === 'login' ? 'selected' : ''} onClick={() => changeMode('login')} aria-pressed={mode === 'login'}>Iniciar sesión</button>
            <button type="button" className={mode === 'register' ? 'selected' : ''} onClick={() => changeMode('register')} aria-pressed={mode === 'register'}>Crear cuenta <ArrowUpRight size={13} /></button>
          </div>

          <form className="entry-form" onSubmit={submit}>
            {mode === 'register' && <div className="entry-name-row"><label>Nombre<input autoComplete="given-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="Tu nombre" required /></label><label>Apellido<input autoComplete="family-name" value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Tu apellido" required /></label></div>}
            <label className="entry-field"><span>Correo electrónico</span><span className="entry-input-wrap"><Mail size={16} /><input type="email" autoComplete="email" placeholder="nombre@correo.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></span></label>
            <label className="entry-field"><span>Contraseña</span><span className="entry-input-wrap"><LockKeyhole size={16} /><input type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="Mínimo 6 caracteres" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required /><button className="entry-reveal" type="button" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span></label>
            {error && <p className="entry-error" role="alert">{error}</p>}
            <button className="entry-submit" type="submit" disabled={busy}><span>{busy ? 'Un momento…' : mode === 'login' ? 'Entrar a mi espacio' : 'Crear mi acceso'}</span><span className="entry-submit-icon"><ArrowRight size={17} /></span></button>
          </form>

          <div className="entry-security"><span className="security-icon"><ShieldCheck size={16} /></span><span><strong>Tu información es solo tuya.</strong><small>Acceso personal protegido.</small></span><span className="security-lock"><LockKeyhole size={14} /></span></div>
          <p className="entry-terms">Al continuar, aceptas las condiciones de uso de GoldenBank.</p>
        </article>
        <div className="entry-side-note"><span className="side-note-icon"><Sparkles size={14} /></span><span>Menos ruido.<br /><strong>Más claridad.</strong></span><ArrowDownLeft size={15} /></div>
      </section>

      <footer className="entry-footer"><span>© 2026 GOLDENBANK</span><span>HECHO PARA EL DÍA A DÍA <i /> COLOMBIA</span><span>CLARO DESDE EL PRINCIPIO</span></footer>
    </main>
  )
}
