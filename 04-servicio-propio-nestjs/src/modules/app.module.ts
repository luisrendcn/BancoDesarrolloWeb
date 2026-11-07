import { Module } from '@nestjs/common'
import { ExchangeController } from './exchange/exchange.controller'
import { ExchangeService } from './exchange/exchange.service'

@Module({
  controllers: [ExchangeController],
  providers: [ExchangeService],
})
export class AppModule {}
