import cors from 'cors'
import express from 'express'
import logger from '../lib/logger'
import HttpServer from './class/server.class'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import userRouter from './routes/product.routes'
import productRouter from './routes/product.routes'


dotenv.config()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
})

const server = HttpServer.instance

server.app.set('trust proxy', 1)

server.app.use(express.urlencoded({ extended: true, limit: '50mb' }))
server.app.use(express.json({ limit: '50mb' }))

server.app.use(cors({ origin: true, credentials: true }))
server.app.use(helmet({ strictTransportSecurity: false }))
server.app.use(limiter);


server.app.use('/product', productRouter)


server.start()

process.on('uncaughtException', (err) => {
  logger.error(`[index/uncaughtException]: ${err.message}`)
  server.stop()
  process.exit(1)
})

process.on('SIGTERM', (message) => {
  logger.error(`[index|SIGTERM]: ${message}`)
})