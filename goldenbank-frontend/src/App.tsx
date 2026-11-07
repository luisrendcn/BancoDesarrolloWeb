import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import AccountsPanel from './components/AccountsPanel'
import ActivityPanel from './components/ActivityPanel'
import AuthScreen from './components/AuthScreen'
import Dashboard from './components/Dashboard'
import DashboardSidebar from './components/DashboardSidebar'
import MarketPanel from './components/MarketPanel'
import type { DashboardContext } from './lib/dashboard-context'
import type { AuthResponse, Account, CompanyProfile, Quote, Transaction } from './lib/api'

const SESSION_KEY = 'bckdbank-session'

function isAuthResponse(value: unknown): value is AuthResponse {
  if (typeof value !== 'object' || value === null) return false
  const session = value as Record<string, unknown>
  return typeof session.token === 'string'
    && typeof session.tokenType === 'string'
    && typeof session.email === 'string'
    && typeof session.role === 'string'
}

function readStoredSession(): AuthResponse | null {
  const storedSession = sessionStorage.getItem(SESSION_KEY)
  if (!storedSession) return null

  let parsedSession: unknown
  try {
    parsedSession = JSON.parse(storedSession)
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error
    sessionStorage.removeItem(SESSION_KEY)
    return null
  }

  if (isAuthResponse(parsedSession)) return parsedSession
  sessionStorage.removeItem(SESSION_KEY)
  return null
}

export default function App() {
  const [session, setSession] = useState<AuthResponse | null>(readStoredSession)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [loadedDashboardKey, setLoadedDashboardKey] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [dashboardError, setDashboardError] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [toast, setToast] = useState('')
  const [symbol, setSymbol] = useState('AAPL')
  const [quote, setQuote] = useState<Quote | null>(null)
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [marketError, setMarketError] = useState('')
  const [marketRetry, setMarketRetry] = useState(0)
  const [loadedMarketKey, setLoadedMarketKey] = useState('')
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    localStorage.getItem('goldenbank-theme') === 'dark' ? 'dark' : 'light',
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('goldenbank-theme', theme)
  }, [theme])

  function authenticate(nextSession: AuthResponse) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextSession))
    setSession(nextSession)
  }

  const context: DashboardContext = {
    session,
    setSession,
    accounts,
    setAccounts,
    transactions,
    setTransactions,
    selectedId,
    setSelectedId,
    loadedDashboardKey,
    setLoadedDashboardKey,
    refreshKey,
    setRefreshKey,
    dashboardError,
    setDashboardError,
    authMessage,
    setAuthMessage,
    toast,
    setToast,
    symbol,
    setSymbol,
    quote,
    setQuote,
    profile,
    setProfile,
    marketError,
    setMarketError,
    marketRetry,
    setMarketRetry,
    loadedMarketKey,
    setLoadedMarketKey,
  }

  const dashboard = session
    ? <DashboardSidebar
        context={context}
        theme={theme}
        onToggleTheme={() => setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')}
      />
    : <Navigate to="/login" replace />

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={session
            ? <Navigate to="/dashboard" replace />
            : <AuthScreen onAuthenticated={authenticate} />}
        />
        <Route path="/dashboard" element={dashboard}>
          <Route index element={<Dashboard />} />
          <Route path="accounts" element={<AccountsPanel />} />
          <Route path="activity" element={<ActivityPanel />} />
          <Route path="exchange" element={<MarketPanel exchangeOnly />} />
          <Route path="market" element={<MarketPanel />} />
        </Route>
        <Route path="*" element={<Navigate to={session ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
