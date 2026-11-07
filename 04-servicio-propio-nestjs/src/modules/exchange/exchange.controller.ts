import { Controller, Get, Inject, Param, Query } from '@nestjs/common'
import { ExchangeService } from './exchange.service'

@Controller('rates')
export class ExchangeController {
  constructor(@Inject(ExchangeService) private readonly exchangeService: ExchangeService) {}

  @Get(':base/:quote')
  getRate(@Param('base') base: string, @Param('quote') quote: string) {
    return this.exchangeService.getRate(base, quote)
  }

  @Get()
  getLatest(@Query('base') base = 'USD', @Query('symbols') symbols = 'COP,EUR') {
    return this.exchangeService.getLatest(base, symbols)
  }
}
