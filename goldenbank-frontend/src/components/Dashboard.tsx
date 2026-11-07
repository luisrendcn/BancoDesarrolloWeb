import { useOutletContext } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, ArrowUpRightFromSquare, BadgeCheck, ChevronRight, CircleHelp, Clock3, CreditCard, Landmark, RefreshCw, ShieldCheck, Sparkles, Wallet } from 'lucide-react'
import type { DashboardContext } from '../lib/dashboard-context'
import { formatMoney, shortDate } from '../lib/formatters'
import { TransactionRow } from './TransactionRow'

export default function Dashboard() {
  const { session, accounts, transactions, dashboardError, refreshKey, setRefreshKey, loading, totalBalance } = useOutletContext<DashboardContext>()
  const balance = totalBalance ?? accounts.reduce((sum, account) => sum + account.balance, 0)
  const visibleTransactions = [...transactions].slice(0, 5)
  const firstName = session?.email.split('@')[0].replace(/[._-]/g, ' ').split(' ')[0] ?? 'amigo'
  const today = new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())

  return (
    <div className="dashboard-page overview-redesign">
      <section className="control-heading page-enter">
        <div><span className="control-date"><span className="live-dot" />{today}</span><h1>Hola, {firstName}.</h1><p>Este es el pulso de tus finanzas hoy.</p></div>
        <button className="button-secondary refresh-button" type="button" onClick={() => setRefreshKey(refreshKey + 1)}><RefreshCw size={15} /> Actualizar datos</button>
      </section>
      {dashboardError && <div className="alert-banner" role="alert">{dashboardError}</div>}

      <section className="finance-hero page-enter delay-1">
        <div className="finance-hero-copy"><span className="hero-overline"><Wallet size={14} /> POSICIÓN TOTAL <span className="hero-divider" /> USD</span><p className="hero-balance">{loading ? 'Cargando…' : formatMoney(balance)}</p><div className="hero-foot"><span><BadgeCheck size={15} /> Disponible entre tus cuentas</span><span className="hero-account-count">{accounts.length} {accounts.length === 1 ? 'cuenta' : 'cuentas'} vinculadas</span></div></div>
        <div className="hero-chart-area" aria-label="Gráfico decorativo de actividad financiera"><div className="chart-label"><span>ACTIVIDAD</span><strong>Tu dinero, en movimiento</strong></div><div className="chart-lines"><i /><i /><i /></div><svg viewBox="0 0 430 144" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="heroChartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#e7be55" stopOpacity=".23"/><stop offset="1" stopColor="#e7be55" stopOpacity="0"/></linearGradient></defs><path d="M0 115 C24 108 29 87 58 95 S93 107 117 73 S151 88 178 66 S209 79 236 47 S267 69 291 54 S325 59 349 26 S389 46 430 9 V144 H0Z" fill="url(#heroChartFill)"/><path d="M0 115 C24 108 29 87 58 95 S93 107 117 73 S151 88 178 66 S209 79 236 47 S267 69 291 54 S325 59 349 26 S389 46 430 9" fill="none" stroke="#e7be55" strokeWidth="2.4" vectorEffect="non-scaling-stroke"/><circle cx="349" cy="26" r="4" fill="#e7be55"/><circle cx="349" cy="26" r="9" fill="#e7be55" opacity=".16"/></svg><div className="chart-periods"><span>INICIO</span><span>ACTUAL</span></div></div>
        <div className="hero-decoration" aria-hidden="true"><span/><span/><span/></div>
      </section>

      <section className="snapshot-grid page-enter delay-2" aria-label="Resumen de cuenta">
        <a className="snapshot-card" href="/dashboard/accounts"><span className="snapshot-icon"><Landmark size={18}/></span><span className="snapshot-label">Cuentas bancarias</span><strong>{loading ? '—' : String(accounts.length).padStart(2,'0')}</strong><span className="snapshot-detail">Ver saldos y detalles <ArrowRight size={14}/></span></a>
        <a className="snapshot-card" href="/dashboard/activity"><span className="snapshot-icon muted-icon"><Clock3 size={18}/></span><span className="snapshot-label">Movimientos registrados</span><strong>{loading ? '—' : String(transactions.length).padStart(2,'0')}</strong><span className="snapshot-detail">Consultar actividad <ArrowRight size={14}/></span></a>
        <a className="snapshot-card snapshot-action" href="/dashboard/exchange"><span className="snapshot-icon exchange-icon"><ArrowUpRight size={18}/></span><span className="snapshot-label">Herramientas</span><strong>Divisas</strong><span className="snapshot-detail">Explorar tasas de cambio <ArrowRight size={14}/></span></a>
      </section>

      <section className="dashboard-lower page-enter delay-2">
        <article className="activity-ledger">
          <div className="ledger-heading"><div><span className="ledger-kicker">TU HISTORIAL</span><h2>Últimos movimientos</h2><p>Una vista clara de lo que ha pasado en tu cuenta.</p></div><a href="/dashboard/activity" className="ledger-link">Historial completo <ArrowUpRightFromSquare size={14}/></a></div>
          <div className="ledger-columns"><span>DESCRIPCIÓN</span><span>FECHA</span><span>IMPORTE</span></div>
          {visibleTransactions.length ? <div className="ledger-list">{visibleTransactions.map((transaction) => <TransactionRow key={transaction.id} transaction={transaction}/>)}</div> : <div className="ledger-empty"><span className="empty-icon"><CreditCard size={19}/></span><strong>{loading ? 'Cargando tu actividad' : 'Tu historial está en blanco'}</strong><p>{loading ? 'En un momento tendrás el resumen listo.' : 'Cuando hagas tu primer movimiento, aparecerá aquí.'}</p></div>}
        </article>
        <aside className="finance-aside">
          <div className="security-note"><span className="security-emblem"><ShieldCheck size={20}/></span><span className="ledger-kicker">PROTECCIÓN ACTIVA</span><h3>Tus finanzas,<br/>bajo control.</h3><p>Tu sesión está protegida. Revisa tus cuentas cuando lo necesites.</p><div className="security-status"><i/> Sesión segura</div></div>
          <div className="support-note"><span><CircleHelp size={17}/></span><div><strong>¿Necesitas ayuda?</strong><small>Estamos aquí para orientarte.</small></div><ChevronRight size={16}/></div>
          <div className="dashboard-date-note"><Sparkles size={13}/> Una buena decisión empieza con información clara.</div>
        </aside>
      </section>
      <span className="sr-only">Fecha de hoy: {shortDate.format(new Date())}</span>
    </div>
  )
}
