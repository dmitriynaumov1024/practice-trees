import { createRouterBuilder } from "../server/createExpress.js"

let route = createRouterBuilder()

route.get("/create", async (request, response)=> {
    return response.status(200).json({ message: `${request.originalUrl}: Not impl. yet` })
})

route.get("/update", async (request, response)=> {
    return response.status(200).json({ message: `${request.originalUrl}: Not impl. yet` })
})

route.get("/get", async (request, response)=> {
    return response.status(200).json({ message: `${request.originalUrl}: Not impl. yet` })
})

export default route
