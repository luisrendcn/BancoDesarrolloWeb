import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Activity, ArrowDownLeft, ArrowRightLeft, ArrowUpRight, Search } from 'lucide-react'
import { TransactionRow } from './TransactionRow'
import type { DashboardContext } from '../lib/dashboard-context'
import TransferDialog from './TransferDialog'

export default function ActivityPanel() {
  const { transactions, accounts, session, loading, onTransferCompleted } = useOutletContext<DashboardContext>()
  const [transferOpen, setTransferOpen] = useState(false)
  return <div className="dashboard-page subpage-page page-enter">
    <section className="page-title-row"><div><span className="eyebrow">TODO EN SU LUGAR</span><h1>Movimientos</h1><p>Un registro claro de la actividad de tu cuenta.</p></div><button className="button-primary" type="button" onClick={() => setTransferOpen(true)} disabled={!accounts.length || !session?.token}><ArrowRightLeft size={16} /> Nueva transferencia</button></section>
    <section className="activity-toolbar surface-card"><div className="activity-search"><Search size={16} /><input placeholder="Buscar movimiento" aria-label="Buscar movimiento" /></div><span className="activity-count"><Activity size={15} /> {transactions.length} {transactions.length === 1 ? 'movimiento' : 'movimientos'}</span></section>
    <section className="surface-card activity-table"><div className="activity-table-head"><span>DETALLE</span><span>FECHA</span><span>MONTO</span></div>{transactions.length ? transactions.map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} />) : <div className="empty-state"><span className="empty-icon"><ArrowDownLeft size={19} /></span><strong>{loading ? 'Cargando actividad…' : 'Todavía no hay movimientos.'}</strong><p>Cuando uses tu cuenta, tus movimientos aparecerán aquí.</p><ArrowUpRight className="empty-decoration" size={16} /></div>}</section>
    {transferOpen && session?.token && <TransferDialog accounts={accounts} token={session.token} onClose={() => setTransferOpen(false)} onCompleted={() => onTransferCompleted?.()} />}
  </div>
}
