import { config as conf } from "dotenv";

conf()

const _config = {
    port: process.env.PORT || 3000,
    frontendDomain: process.env.FORNTEND_DOMAIN,
    env: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET,
}

export const config = Object.freeze(_config)