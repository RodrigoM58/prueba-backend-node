import http from 'http'
import MongoConn from '../../lib/mongodb'
import express from 'express'
import logger from '../../lib/logger';

export default class HttpServer {
    private port: number
    private httpServer: http.Server
    private static _instance: HttpServer
    private mongodb: MongoConn
    public app: express.Application

    private constructor() {
        this.port = Number(process.env.PORT) || 5002
        this.app = express()
        this.httpServer = new http.Server(this.app)
        this.mongodb = MongoConn.instance
    }

    public static get instance() {
        return this._instance || ( this._instance = new this() )
    }

    async start() {
        try {
            this.httpServer.listen(this.port)
            logger.info(`[HttpServer/start]: Server run on port ${ this.port }`)
        } catch( err: any ) {
            return logger.error(`[HttpServer/start] Error ${ err }`)
        }
    }

    async stop() {
        try {
            this.httpServer.close()
            logger.info('[HttpServer/stop]: Server stopped');
        } catch( err: any ) {
            logger.error(`[HttpServer/stop] Error ${err}`);
        }
    }
}