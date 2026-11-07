import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { ArrowDownUp, ArrowLeftRight, ArrowUpRight, BadgeInfo, BarChart3, Building2, CalendarDays, Clock3, RefreshCw, Search, Sparkles, TrendingUp } from 'lucide-react'
import { exchangeApi, marketApi, type ExchangeRate } from '../lib/api'
import type { DashboardContext } from '../lib/dashboard-context'
import { formatMarketMoney } from '../lib/formatters'

const currencies = [
  { code: 'USD', name: 'Dólar estadounidense', flag: '🇺🇸' },
  { code: 'COP', name: 'Peso colombiano', flag: '🇨🇴' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'Libra esterlina', flag: '🇬🇧' },
  { code: 'JPY', name: 'Yen japonés', flag: '🇯🇵' },
  { code: 'CAD', name: 'Dólar canadiense', flag: '🇨🇦' },
]

interface MarketPanelProps { exchangeOnly?: boolean }

export default function MarketPanel({ exchangeOnly = false }: MarketPanelProps) {
  const context = useOutletContext<DashboardContext>()
  const { session, symbol, setSymbol, quote, setQuote, profile, setProfile, marketError, setMarketError, marketRetry, setMarketRetry, setLoadedMarketKey, loadedMarketKey } = context
  const [base, setBase] = useState('USD')
  const [target, setTarget] = useState('COP')
  const [rate, setRate] = useState<ExchangeRate | null>(null)
  const [rateError, setRateError] = useState('')
  const [rateLoading, setRateLoading] = useState(false)
  const [amount, setAmount] = useState('1')

  useEffect(() => {
    if (exchangeOnly || !symbol.trim() || !session?.token) return
    const key = `${symbol}:${marketRetry}`
    if (key === loadedMarketKey) return
    let active = true
    setMarketError('')
    Promise.all([marketApi.getQuote(symbol.trim()), marketApi.getProfile(symbol.trim())])
      .then(([nextQuote, nextProfile]) => {
        if (!active) return
        setQuote(nextQuote)
        setProfile(nextProfile)
        setLoadedMarketKey(key)
      })
      .catch((error: unknown) => { if (active) setMarketError(error instanceof Error ? error.message : 'No fue posible consultar el mercado.') })
    return () => { active = false }
  }, [exchangeOnly, symbol, marketRetry, loadedMarketKey, session, setMarketError, setLoadedMarketKey, setProfile, setQuote])

  useEffect(() => {
    if (!exchangeOnly || !session?.token) return
    let active = true
    Promise.resolve().then(() => {
      if (active) {
        setRateLoading(true)
        setRateError('')
        setRate(null)
      }
      return exchangeApi.getRate(base, target, session.token)
    })
      .then((nextRate) => { if (active) setRate(nextRate) })
      .catch((error: unknown) => { if (active) setRateError(error instanceof Error ? error.message : 'No fue posible consultar la tasa.') })
      .finally(() => { if (active) setRateLoading(false) })
    return () => { active = false }
  }, [exchangeOnly, base, target, session, context.refreshKey])

  function swapCurrencies() {
    setBase(target)
    setTarget(base)
  }

  const baseCurrency = currencies.find((currency) => currency.code === base)
  const targetCurrency = currencies.find((currency) => currency.code === target)
  const converted = rate ? Number(amount || 0) * rate.rate : 0

  if (!exchangeOnly) {
    return <div className="dashboard-page subpage-page page-enter">
      <section className="page-title-row"><div><span className="eyebrow">DATOS DEL MERCADO</span><h1>Mercados</h1><p>Una ventana al pulso de las compañías que sigues.</p></div><span className="market-source-pill"><span /> Finnhub</span></section>
      <section className="market-search-card surface-card"><label htmlFor="ticker-search"><Search size={18} /><input id="ticker-search" value={symbol} onChange={(event) => setSymbol(event.target.value.toUpperCase())} onKeyDown={(event) => { if (event.key === 'Enter') setMarketRetry((retry) => retry + 1) }} placeholder="Busca un símbolo, por ejemplo AAPL" /><button type="button" className="button-primary" onClick={() => setMarketRetry((retry) => retry + 1)}>Consultar</button></label></section>
      {marketError && <div className="alert-banner" role="alert">{marketError}<button type="button" onClick={() => setMarketRetry((retry) => retry + 1)}><RefreshCw size={14} /> Reintentar</button></div>}
      <section className="market-results-grid">
        <article className="market-quote-card surface-card"><div className="section-heading"><div><span className="eyebrow">COTIZACIÓN</span><h2>{profile?.name || symbol || 'Elige una compañía'}</h2></div><span className="market-company-icon"><Building2 size={21} /></span></div><div className="quote-value">{quote ? formatMarketMoney(quote.c, profile?.currency) : '—'}</div><div className={`quote-change ${(quote?.d ?? 0) >= 0 ? 'positive' : 'negative'}`}><TrendingUp size={16} /> {quote ? `${quote.d >= 0 ? '+' : ''}${quote.d.toFixed(2)} (${quote.dp.toFixed(2)}%) hoy` : 'Busca una compañía para consultar'}</div><div className="quote-rule" /><div className="quote-meta"><span><small>Máximo del día</small><strong>{quote ? formatMarketMoney(quote.h, profile?.currency) : '—'}</strong></span><span><small>Mínimo del día</small><strong>{quote ? formatMarketMoney(quote.l, profile?.currency) : '—'}</strong></span><span><small>Cierre anterior</small><strong>{quote ? formatMarketMoney(quote.pc, profile?.currency) : '—'}</strong></span></div></article>
        <article className="market-insight-card"><span className="insight-icon"><BarChart3 size={20} /></span><span className="eyebrow light">UNA MIRADA AL MERCADO</span><h3>Información clara para seguir aprendiendo.</h3><p>Consulta datos de mercado y mantén tus decisiones con los pies en la tierra.</p><span className="insight-foot"><Clock3 size={14} /> Fuente de datos: Finnhub</span></article>
      </section>
      {!quote && !marketError && <div className="market-hint"><BadgeInfo size={16} /> Introduce el símbolo de una acción y pulsa Consultar para ver sus datos.</div>}
    </div>
  }

  return <div className="dashboard-page subpage-page page-enter">
    <section className="page-title-row"><div><span className="eyebrow"><Sparkles size={13} /> TASA DE CAMBIO DE REFERENCIA</span><h1>Divisas</h1><p>Consulta el valor de una moneda frente a otra.</p></div><span className="market-source-pill"><span /> Tasas de referencia</span></section>
    <section className="exchange-layout">
      <article className="exchange-converter surface-card"><div className="section-heading"><div><span className="eyebrow">CONVERSOR</span><h2>Haz tus cuentas con claridad.</h2></div><span className="exchange-icon"><ArrowLeftRight size={20} /></span></div>
        <label className="amount-label">Quiero convertir<input inputMode="decimal" type="number" min="0" step="any" value={amount} onChange={(event) => setAmount(event.target.value)} /></label>
        <div className="currency-pair"><label><span>DE</span><select value={base} onChange={(event) => setBase(event.target.value)}>{currencies.map((currency) => <option key={currency.code} value={currency.code}>{currency.flag} {currency.code} · {currency.name}</option>)}</select></label><button type="button" className="swap-button" aria-label="Intercambiar monedas" onClick={swapCurrencies}><ArrowDownUp size={17} /></button><label><span>A</span><select value={target} onChange={(event) => setTarget(event.target.value)}>{currencies.map((currency) => <option key={currency.code} value={currency.code}>{currency.flag} {currency.code} · {currency.name}</option>)}</select></label></div>
        {rateError && <div className="form-error" role="alert">{rateError}</div>}
        <div className="conversion-result"><span className="eyebrow">VALOR ESTIMADO</span><strong>{rateLoading ? 'Consultando…' : formatMarketMoney(converted, target)}</strong><span>{amount || '0'} {base} <ArrowUpRight size={14} /> {target}</span></div>
        <button type="button" className="button-secondary rate-refresh" onClick={() => context.setRefreshKey((key) => key + 1)}><RefreshCw size={15} /> Actualizar tasa</button>
      </article>
      <aside className="exchange-aside"><article className="rate-highlight"><div className="rate-highlight-top"><span className="eyebrow light">TASA DE REFERENCIA</span><span className="rate-pulse"><i /> ACTUAL</span></div><div className="rate-currencies"><span>{baseCurrency?.flag} {base}</span><ArrowLeftRight size={15} /><span>{targetCurrency?.flag} {target}</span></div><strong>{rateLoading ? '—' : rate ? rate.rate.toLocaleString('es-CO', { maximumFractionDigits: 4 }) : '—'}</strong><p>1 {base} equivale a {rate ? rate.rate.toLocaleString('es-CO', { maximumFractionDigits: 4 }) : '—'} {target}</p><div className="rate-date"><CalendarDays size={14} /> Referencia del {rate?.date ?? '—'}</div></article>
        <article className="provider-card surface-card"><div className="provider-card-logo">f.</div><div><strong>Datos de Frankfurter</strong><p>Tasas de referencia de bancos centrales y fuentes oficiales, con actualización diaria.</p></div><span className="provider-check">✓</span></article><div className="rate-disclaimer"><BadgeInfo size={15} /><p>Estas tasas de referencia se actualizan a diario; pueden diferir de las aplicadas por entidades financieras.</p></div></aside>
    </section>
    <section className="currency-footnote"><span><Clock3 size={15} /> La fecha mostrada corresponde al dato de referencia disponible.</span><a href="https://frankfurter.dev/" target="_blank" rel="noreferrer">Documentación de Frankfurter <ArrowUpRight size={14} /></a></section>
  </div>
}
