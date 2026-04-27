import "dotenv/config"
import cookieParser from "cookie-parser"
import express from "express"

import "./utils/fileSetup.js"
import { authRouter } from "./routes/auth.routes.js"
import { contentRouter } from "./routes/content.routes.js"
import { approvalRouter } from "./routes/approval.routes.js"
import { GlobalErrorHandler } from "./utils/GlobalError.js"

export const app = express()

app.use(cookieParser())
app.use(express.json())

app.use("/api/auth", authRouter)
app.use("/api/content", contentRouter)
app.use("/api/approve", approvalRouter)

app.use(GlobalErrorHandler)