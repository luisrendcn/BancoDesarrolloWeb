import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import type { Transaction } from '../lib/api'
import { formatMoney, shortDate } from '../lib/formatters'

export function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isCredit = transaction.transactionType.toUpperCase().includes('DEPOSIT')
  return (
    <div className="transaction-row">
      <span className={`transaction-icon ${isCredit ? 'credit' : 'debit'}`}>{isCredit ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}</span>
      <span className="transaction-detail"><strong>{transaction.description || (isCredit ? 'Ingreso a cuenta' : 'Transferencia')}</strong><small>{transaction.timestamp ? shortDate.format(new Date(transaction.timestamp)) : 'Movimiento reciente'}</small></span>
      <span className={`transaction-amount ${isCredit ? 'positive' : ''}`}>{isCredit ? '+' : '−'}{formatMoney(transaction.amount)}</span>
    </div>
  )
}

export default TransactionRow
