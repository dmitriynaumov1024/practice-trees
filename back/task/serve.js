import { createApplication } from "../src/application.js"

let app = await createApplication()
app.listen({ host: "0.0.0.0", port: 8000 })
