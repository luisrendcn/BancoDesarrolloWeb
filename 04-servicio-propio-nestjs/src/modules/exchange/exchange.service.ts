import { BadGatewayException, BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common'

interface FrankfurterRate {
  date: string
  base: string
  quote: string
  rate: number
}

interface FrankfurterLatest {
  date: string
  base: string
  quotes: Record<string, number>
}

@Injectable()
export class ExchangeService {
  private readonly baseUrl = (process.env.FRANKFURTER_BASE_URL ?? 'https://api.frankfurter.dev/v2').replace(/\/$/, '')

  async getRate(base: string, quote: string): Promise<FrankfurterRate> {
    const [safeBase, safeQuote] = this.validateCurrencies(base, quote)
    const data = await this.request<FrankfurterRate>(`${this.baseUrl}/rate/${safeBase}/${safeQuote}`)
    return { date: data.date, base: data.base, quote: data.quote, rate: data.rate }
  }

  async getLatest(base: string, symbols: string): Promise<FrankfurterLatest> {
    const safeBase = this.validateCurrency(base)
    const safeSymbols = [...new Set(symbols.split(',').map((symbol) => this.validateCurrency(symbol)))].join(',')
    const data = await this.request<FrankfurterRate[]>(
      `${this.baseUrl}/rates?base=${safeBase}&quotes=${safeSymbols}`,
    )
    return {
      date: data[0]?.date ?? new Date().toISOString().slice(0, 10),
      base: safeBase,
      quotes: Object.fromEntries(data.map(({ quote, rate }) => [quote, rate])),
    }
  }

  private validateCurrencies(base: string, quote: string): [string, string] {
    return [this.validateCurrency(base), this.validateCurrency(quote)]
  }

  private validateCurrency(currency: string): string {
    const normalized = currency.trim().toUpperCase()
    if (!/^[A-Z]{3}$/.test(normalized)) {
      throw new BadRequestException('Currency codes must contain three letters, such as USD or COP.')
    }
    return normalized
  }

  private async request<T>(url: string): Promise<T> {
    let response: Response
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(8000) })
    } catch {
      throw new ServiceUnavailableException('The exchange rate provider is temporarily unavailable.')
    }
    if (response.status === 404) throw new BadRequestException('No exchange rate was found for those currencies.')
    if (!response.ok) throw new BadGatewayException('The exchange rate provider returned an error.')
    return response.json() as Promise<T>
  }
}
