import type { Dispatch, SetStateAction } from 'react'
import type { Account, AuthResponse, CompanyProfile, Quote, Transaction } from './api'

export interface DashboardContext {
  session: AuthResponse | null
  setSession: Dispatch<SetStateAction<AuthResponse | null>>
  accounts: Account[]
  setAccounts: Dispatch<SetStateAction<Account[]>>
  transactions: Transaction[]
  setTransactions: Dispatch<SetStateAction<Transaction[]>>
  selectedId: number | null
  setSelectedId: Dispatch<SetStateAction<number | null>>
  loadedDashboardKey: string
  setLoadedDashboardKey: Dispatch<SetStateAction<string>>
  refreshKey: number
  setRefreshKey: Dispatch<SetStateAction<number>>
  dashboardError: string
  setDashboardError: Dispatch<SetStateAction<string>>
  authMessage: string
  setAuthMessage: Dispatch<SetStateAction<string>>
  toast: string
  setToast: Dispatch<SetStateAction<string>>
  symbol: string
  setSymbol: Dispatch<SetStateAction<string>>
  quote: Quote | null
  setQuote: Dispatch<SetStateAction<Quote | null>>
  profile: CompanyProfile | null
  setProfile: Dispatch<SetStateAction<CompanyProfile | null>>
  marketError: string
  setMarketError: Dispatch<SetStateAction<string>>
  marketRetry: number
  setMarketRetry: Dispatch<SetStateAction<number>>
  loadedMarketKey: string
  setLoadedMarketKey: Dispatch<SetStateAction<string>>
  loading?: boolean
  totalBalance?: number
  transactionCount?: number
  onTransferCompleted?: () => void
}
