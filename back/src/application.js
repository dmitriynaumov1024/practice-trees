import { createServer } from "./server/createServer.js"

import tree from "./route/tree.js"

async function createApplication() {
    let server = createServer({ })
    // server.http.get("/sum", (request, response)=> {
    //     let sum = Number(request.query.a ?? 0) + Number(request.query.b ?? 0)
    //     response.status(200).json({ sum })
    // })
    // server.http.router("/api/calculator", (calc) => {
    //     calc.get("/sum", (request, response)=> {
    //         let numbers = (request.query.numbers ?? "").split(",").map(Number)
    //         let sum = numbers.reduce((prev, item)=> prev + item, 0)
    //         response.status(200).json({ sum })
    //     })
    // })
    server.http.router("/api/tree", tree)
    return server
}

export {
    createApplication
}
