import { useState, type FormEvent } from 'react'
import { ArrowDownUp, ArrowRight, CheckCircle2, LoaderCircle, X } from 'lucide-react'
import { bankApi, type Account } from '../lib/api'
import { formatMoney } from '../lib/formatters'

interface TransferDialogProps {
  accounts: Account[]
  token: string
  onClose: () => void
  onCompleted: () => void
}

export default function TransferDialog({ accounts, token, onClose, onCompleted }: TransferDialogProps) {
  const [source, setSource] = useState(accounts[0]?.accountNumber ?? '')
  const [destination, setDestination] = useState('003000118')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [complete, setComplete] = useState(false)
  const sourceAccount = accounts.find((account) => account.accountNumber === source)
  const numericAmount = Number(amount)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (!sourceAccount) return setError('Selecciona una cuenta de origen.')
    if (destination.trim() === source) return setError('La cuenta de destino debe ser diferente a la de origen.')
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) return setError('Ingresa un monto mayor que cero.')
    if (numericAmount > sourceAccount.balance) return setError('El monto supera el saldo disponible.')

    setSending(true)
    try {
      await bankApi.transfer({
        sourceAccountNumber: source,
        destinationAccountNumber: destination.trim(),
        amount: numericAmount,
        description: description.trim() || 'Transferencia',
      }, token)
      setComplete(true)
      onCompleted()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo completar la transferencia.')
    } finally {
      setSending(false)
    }
  }

  return <div className="transfer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !sending) onClose() }}>
    <section className="transfer-dialog surface-card" role="dialog" aria-modal="true" aria-labelledby="transfer-title">
      <header className="transfer-dialog-header"><span className="transfer-dialog-icon"><ArrowDownUp size={19} /></span><button className="icon-button" type="button" aria-label="Cerrar" onClick={onClose} disabled={sending}><X size={19} /></button></header>
      {complete ? <div className="transfer-success"><CheckCircle2 size={36} /><span className="eyebrow">OPERACIÓN COMPLETADA</span><h2 id="transfer-title">Transferencia enviada</h2><p>El movimiento quedó registrado. Los saldos e historial se están actualizando.</p><button className="button-primary" type="button" onClick={onClose}>Listo</button></div> : <>
        <span className="eyebrow">ENTRE CUENTAS</span><h2 id="transfer-title">Nueva transferencia</h2><p className="transfer-description">Envía dinero a otra cuenta GoldenBank.</p>
        <form className="transfer-form" onSubmit={submit}>
          <label>Cuenta de origen<select value={source} onChange={(event) => setSource(event.target.value)} required>{accounts.map((account) => <option key={account.id} value={account.accountNumber}>{account.accountType === 'CHECKING' ? 'Cuenta principal' : account.accountType} · •••• {account.accountNumber.slice(-4)} · {formatMoney(account.balance)}</option>)}</select></label>
          <label>Número de cuenta destino<input value={destination} onChange={(event) => setDestination(event.target.value.replace(/\s/g, ''))} placeholder="Ej. 003123456" autoComplete="off" required /></label>
          <label>Monto<input type="number" min="0.01" max={sourceAccount?.balance ?? undefined} step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" required /><small>Se descontará de la cuenta de Hector. Disponible: {formatMoney(sourceAccount?.balance ?? 0)}</small></label>
          <label>Descripción <span className="transfer-optional">Opcional</span><input maxLength={255} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="¿Para qué es esta transferencia?" /></label>
          {error && <div className="alert-banner" role="alert">{error}</div>}
          <div className="transfer-form-footer"><span>Origen: •••• {source.slice(-4)}</span><button className="button-primary transfer-submit" type="submit" disabled={sending || accounts.length === 0}>{sending ? <><LoaderCircle className="transfer-spinner" size={16} /> Enviando…</> : <>Realizar transferencia <ArrowRight size={16} /></>}</button></div>
        </form>
      </>}
    </section>
  </div>
}
