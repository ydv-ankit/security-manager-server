import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, colorize } = format;

export const logger = (data: string, logType: "ERROR" | "INFO") => {
    console.log(`${new Date().toLocaleString()} ${logType} -> ${data}`);
};

const consoleLogFormat = format.combine(
    format.colorize(),
    format.printf(({ level, message, timestamp }) => {
        return `${timestamp} ${level}: ${message}`;
    })
);

export const requestLogger = createLogger({
    level: "info",
    format: combine(colorize(), timestamp(), json()),
    transports: [
        new transports.Console({
            format: consoleLogFormat,
        }),
        new transports.File({ filename: "logs/app.log" }),
    ],
});
