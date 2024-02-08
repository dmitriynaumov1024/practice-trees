import { TreeRepo } from "../common/TreeRepo.js"
import { createRouterBuilder } from "../server/createExpress.js"
let route = createRouterBuilder()

route.post("/create", async (request, response)=> {
    return response.status(200).json({
        tree: await TreeRepo.create(),
        success: true
    })
})

route.post("/update", async (request, response)=> {
    let tree = request.body.tree
    if (!tree || !tree.id) return response.status(400).json({
        success: false,
        badRequest: true
    })
    return response.status(200).json({
        success: await TreeRepo.save(tree),
        tree: tree
    })
})

route.get("/get", async (request, response)=> {
    let tree = await TreeRepo.get(request.query.id)
    return response.status(200).json({
        tree: tree,
        success: !!tree,
        notFound: !tree
    })
})

route.get("/access", async (request, response)=> {
    return response.status(200).json({
        success: await TreeRepo.access(request.query.id)
    })
})

export default route
