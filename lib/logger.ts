import pino from 'pino'

const loggerLevel = process.env.LOGGER_LEVEL || 'info';

const streams = [
    { stream: process.stdout }
]

const options = { level: loggerLevel };
const logger = pino(options, pino.multistream(streams));

export default logger;