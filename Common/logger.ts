import createLogger from "log-stdout";

export default createLogger((process.env.LOG_LEVEL as any) || "debug");
