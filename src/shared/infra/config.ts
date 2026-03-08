import { join } from "path"
import { config as readEnv } from "dotenv"

export class Config {
  static env: any = null

  static db() {
    Config.readEnv()
    return {
      dialect: Config.env.DB_DIALECT,
      host: Config.env.DB_HOST,
      logging: Config.env.DB_LOGGING === "true",
    }
  }

  static readEnv() {
    if (Config.env) return

    readEnv({
      path: join(__dirname, `../../../envs/.env.${process.env.NODE_ENV}`)
    })

    Config.env = process.env
  }
}
