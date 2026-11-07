import 'reflect-metadata'
import { existsSync } from 'node:fs'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app.module'

async function bootstrap() {
  if (existsSync('.env')) process.loadEnvFile()
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
  const port = Number(process.env.PORT ?? 3000)
  await app.listen(port, '0.0.0.0')
  console.log(`Exchange service listening on port ${port}`)
}

void bootstrap()
