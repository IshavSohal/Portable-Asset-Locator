const winstonLogging = require('winston');
const { combine, timestamp, json, colorize, printf, align } = winstonLogging.format;

export class ConsoleLogger {
    static readonly consoleLogger = 
    winstonLogging.createLogger({
        level: 'info',
        format: combine(colorize({all:true}), timestamp(), align(),
        printf((info:any) => `[${info.timestamp}] ${info.level}: ${info.message}`)),
        transports: [new winstonLogging.transports.Console()],
    });

    static log(message:string):void{
        this.consoleLogger.info(message);
    }
}