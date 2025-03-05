import mongoose from 'mongoose'
import logger from './logger'

export default class MongoConn {

  mongoConn: mongoose.Connection
  private static _instance: MongoConn

  private constructor() {
    this.mongoConn = mongoose.connection;
    this.setupEventHandlers()
    this.connectDB();
  }

  public static get instance(): MongoConn {
    return this._instance || ( this._instance = new this() )
  }

  private setupEventHandlers(): void {
    this.mongoConn.on('connected', () => {
      logger.info(`[MongoConn]: Connected to database ${process.env.MONGO_DATABASE}`)
    });

    this.mongoConn.on('error', (err) => {
      logger.error(`[MongoConn]: Database connection error - ${err.message}`)
      this.handleDBConnectionError(err);
    });
  }

  public async connectDB(): Promise<void> {
    mongoose.set('strictQuery', false);
    mongoose.set('bufferCommands', true);

    const mongoURI = process.env.MONGO_URI as string;
    const options: mongoose.ConnectOptions = {
      user: process.env.MONGO_USER || undefined,
      pass: process.env.MONGO_PASS || undefined,
      dbName: process.env.MONGO_DATABASE,
      authSource: process.env.MONGO_AUTH_SOURCE || undefined
    };

    try {
      await mongoose.connect(mongoURI, options);
      logger.info('[MongoConn]: Successfully connected to MongoDB');
    } catch (err) {
      this.handleDBConnectionError(err);
    }
  }

  private handleDBConnectionError(error: any): void {
    logger.error(`[MongoConn/connectDB]: Error - ${error.message}`);

    const retryInterval = parseInt(process.env.MONGO_RETRY_INTERVAL || '5000', 10);
    const maxRetries = parseInt(process.env.MONGO_MAX_RETRIES || '-1', 10);

    if (maxRetries === -1 || maxRetries > 0) {
      logger.info(`[MongoConn/connectDB]: Retrying connection in ${retryInterval} ms...`);

      setTimeout(async () => {
        if (maxRetries > 0) {
          process.env.MONGO_MAX_RETRIES = (maxRetries - 1).toString();
        }
        await this.connectDB();
      }, retryInterval);
    } else {
      logger.error('[MongoConn/connectDB]: Maximum retry attempts reached. Exiting application.');
      process.exit(1);
    }
  }
}