import "dotenv/config"
import { createServer } from "./server/createServer.js"

import tree from "./route/tree.js"

async function createApplication() {
    let server = createServer({ })
    server.http.router("/api/tree", tree)
    server.http.static("./dist/public")
    server.http.fallback("./dist/public/index.html")
    return server
}

export {
    createApplication
}
