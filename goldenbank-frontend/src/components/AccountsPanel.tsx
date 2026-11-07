import { useOutletContext } from 'react-router-dom'
import { ArrowRight, BadgeCheck, CreditCard, Ellipsis, Plus, Wallet } from 'lucide-react'
import type { DashboardContext } from '../lib/dashboard-context'
import { formatMoney } from '../lib/formatters'

export default function AccountsPanel() {
  const { accounts, selectedId, setSelectedId, loading, totalBalance } = useOutletContext<DashboardContext>()
  return (
    <div className="dashboard-page subpage-page page-enter">
      <section className="page-title-row"><div><span className="eyebrow">TU DINERO, ORGANIZADO</span><h1>Mis cuentas</h1><p>Todo lo que necesitas, en un solo lugar.</p></div><button type="button" className="button-primary" disabled><Plus size={17} /> Nueva cuenta</button></section>
      <section className="account-total-card"><div><span>Saldo consolidado</span><strong>{loading ? 'Cargando…' : formatMoney(totalBalance ?? 0)}</strong><small>Entre todas tus cuentas activas</small></div><span className="account-total-icon"><Wallet size={22} /></span></section>
      <div className="section-heading accounts-heading"><div><span className="eyebrow">TU CARTERA</span><h2>{accounts.length} {accounts.length === 1 ? 'cuenta activa' : 'cuentas activas'}</h2></div><span className="verified-pill"><BadgeCheck size={15} /> Verificadas</span></div>
      {accounts.length ? <section className="accounts-grid">{accounts.map((account, index) => <article key={account.id} className={`account-card ${index === 0 ? 'account-card-featured' : ''}`}><div className="account-card-top"><span className="account-type-icon"><CreditCard size={19} /></span><button type="button" className="icon-button" aria-label="Más opciones"><Ellipsis size={19} /></button></div><span className="account-label">{account.accountType === 'CHECKING' ? 'Cuenta de ahorros' : account.accountType}</span><strong className="account-balance">{formatMoney(account.balance)}</strong><div className="account-number"><span>•••• •••• {account.accountNumber.slice(-4)}</span><span className="account-brand-mini">b.</span></div><button type="button" className="account-select" onClick={() => setSelectedId(account.id)} aria-pressed={selectedId === account.id}>{selectedId === account.id ? 'Cuenta seleccionada' : 'Ver cuenta'} <ArrowRight size={14} /></button></article>)}</section> : <div className="surface-card empty-state account-empty"><span className="empty-icon"><Wallet size={20} /></span><strong>{loading ? 'Cargando tus cuentas…' : 'Aún no hay cuentas para mostrar.'}</strong><p>Vuelve a intentarlo en un momento.</p></div>}
    </div>
  )
}
