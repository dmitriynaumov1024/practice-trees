import "dotenv/config"
import { createApplication } from "../src/application.js"

let app = await createApplication()

let port = Number(process.env.HTTP_PORT) || 8000 
let host = process.env.HTTP_HOST ?? "0.0.0.0"

console.log("Server listening to " + host + ":" + port)

app.listen({ host, port })
