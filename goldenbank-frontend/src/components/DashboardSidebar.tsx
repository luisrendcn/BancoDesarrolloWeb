import { useEffect, useMemo, useState } from 'react'
import { Activity, ArrowLeftRight, ArrowRightLeft, ArrowUpRight, BadgeDollarSign, ChevronDown, CircleHelp, LayoutDashboard, LogOut, Menu, Moon, Settings2, Sun, Wallet } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { bankApi } from '../lib/api'
import type { DashboardContext } from '../lib/dashboard-context'
import BrandMark from './BrandMark'
import TransferDialog from './TransferDialog'

interface DashboardSidebarProps { context: DashboardContext; theme: 'dark' | 'light'; onToggleTheme: () => void }

const navigation = [
  { to: '/dashboard', label: 'Resumen', icon: LayoutDashboard, end: true },
  { to: '/dashboard/accounts', label: 'Mis cuentas', icon: Wallet },
  { to: '/dashboard/activity', label: 'Movimientos', icon: Activity },
  { to: '/dashboard/exchange', label: 'Divisas', icon: ArrowLeftRight },
  { to: '/dashboard/market', label: 'Mercados', icon: BadgeDollarSign },
]

export default function DashboardSidebar({ context, theme, onToggleTheme }: DashboardSidebarProps) {
  const { session, setSession, accounts, setAccounts, transactions, setTransactions, refreshKey, setRefreshKey, setDashboardError } = context
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const current = navigation.find((item) => item.to === location.pathname)
  const totalBalance = useMemo(() => accounts.reduce((sum, account) => sum + account.balance, 0), [accounts])

  useEffect(() => {
    if (!session?.token) return
    let active = true
    Promise.resolve().then(() => {
      if (active) setDashboardError('')
    })
    bankApi.getAccounts(session.token)
      .then(async (nextAccounts) => {
        if (!active) return
        setAccounts(nextAccounts)
        const selected = nextAccounts[0]
        if (selected) {
          const history = await bankApi.getTransactions(selected.accountNumber, session.token)
          if (active) setTransactions(history)
        } else if (active) setTransactions([])
      })
      .catch((error: unknown) => {
        if (active) setDashboardError(error instanceof Error ? error.message : 'No se pudieron cargar tus cuentas.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [session, refreshKey, setAccounts, setDashboardError, setTransactions])

  function signOut() {
    sessionStorage.removeItem('bckdbank-session')
    setSession(null)
    setAccounts([])
    setTransactions([])
    navigate('/login', { replace: true })
  }

  function closeNavigation() {
    setMenuOpen(false)
  }

  const displayName = session?.email.split('@')[0].replace(/[._-]/g, ' ') ?? 'Mi cuenta'

  return (
    <div className="dashboard-layout">
      <main className="dashboard-main">
        <header className="topbar">
          <div className="topbar-brand-menu">
            <Link to="/dashboard" className="brand"><BrandMark /><span className="brand-name">Golden<span>Bank</span></span></Link>
            <div className={`nav-menu-container ${menuOpen ? 'is-open' : ''}`} onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)} onKeyDown={(event) => { if (event.key === 'Escape') setMenuOpen(false) }}>
              <button className="nav-menu-trigger" type="button" aria-haspopup="true" aria-expanded={menuOpen} onClick={() => { if (window.matchMedia('(hover: hover)').matches) setMenuOpen(true); else setMenuOpen((open) => !open) }}><Menu size={16} /><span>Navegación</span><ChevronDown className="nav-menu-chevron" size={14} /></button>
              <div className="nav-menu-dropdown">
                <span className="nav-menu-label">TU ESPACIO</span>
                <nav aria-label="Navegación principal" className="main-navigation">
                  {navigation.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={closeNavigation}><Icon size={17} strokeWidth={1.8} /><span>{label}</span>{label === 'Divisas' && <span className="nav-new">NUEVO</span>}</NavLink>)}
                </nav>
                <button className="sidebar-utility sidebar-transfer-action" type="button" disabled={!accounts.length || !session?.token} onClick={() => { closeNavigation(); setTransferOpen(true) }}><ArrowRightLeft size={17} /> Nueva transferencia <span className="transfer-menu-arrow">↗</span></button>
                <div className="nav-menu-divider" />
                <span className="nav-menu-label">AYUDA Y AJUSTES</span>
                <button className="sidebar-utility" type="button" onClick={closeNavigation}><CircleHelp size={16} /> Centro de ayuda</button>
                <button className="sidebar-utility" type="button" onClick={closeNavigation}><Settings2 size={16} /> Preferencias</button>
              </div>
            </div>
          </div>
          <div className="breadcrumbs"><span>Tu espacio</span><span>/</span><strong>{current?.label ?? 'Resumen'}</strong></div>
          <div className="topbar-right"><span className="secure-status"><i /> Cuenta segura</span><div className={`user-menu-container ${profileOpen ? 'is-open' : ''}`} onMouseEnter={() => setProfileOpen(true)} onMouseLeave={() => setProfileOpen(false)} onKeyDown={(event) => { if (event.key === 'Escape') setProfileOpen(false) }}>
            <button type="button" className="topbar-profile" aria-haspopup="true" aria-expanded={profileOpen} onClick={() => { if (window.matchMedia('(hover: hover)').matches) setProfileOpen(true); else setProfileOpen((open) => !open) }}><span className="avatar small">{displayName.slice(0, 1).toUpperCase()}</span><span>{displayName}</span><ChevronDown className="user-menu-chevron" size={14}/></button>
            <div className="user-menu-dropdown"><div className="user-menu-identity"><span className="avatar">{displayName.slice(0, 1).toUpperCase()}</span><span><strong>{displayName}</strong><small>{session?.email}</small></span></div><button className="user-menu-theme" type="button" onClick={onToggleTheme}>{theme === 'dark' ? <Sun size={15}/> : <Moon size={15}/>} Cambiar a modo {theme === 'dark' ? 'claro' : 'oscuro'}</button><button className="user-menu-signout" type="button" onClick={signOut}><LogOut size={15}/> Cerrar sesión</button></div>
          </div></div>
        </header>
        <div className="page-content" key={location.pathname}>
          <Outlet context={{ ...context, loading, totalBalance, transactionCount: transactions.length, onTransferCompleted: () => setRefreshKey((key) => key + 1) }} />
        </div>
        <footer className="dashboard-footer"><span>© 2026 GoldenBank</span><div className="footer-reminder"><span className="footer-reminder-icon"><ArrowUpRight size={14}/></span><span><strong>Un paso a la vez.</strong><small>Pequeñas decisiones, grandes planes.</small></span></div></footer>
      </main>
      {transferOpen && session?.token && <TransferDialog accounts={accounts} token={session.token} onClose={() => setTransferOpen(false)} onCompleted={() => setRefreshKey((key) => key + 1)} />}
    </div>
  )
}
