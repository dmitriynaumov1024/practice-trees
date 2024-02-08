import path from "node:path"
import fs from "node:fs/promises"
import { randomId, fileExists } from "./utils.js"

const baseDir = path.join(process.env.STORAGE_DIR, "trees")

await fs.mkdir(baseDir, { recursive: true })

function resolveTreePath (treeId) {
    return path.join(baseDir, treeId + ".json")
}

async function getUniqueId () {
    let id = null
    while (!id || await fileExists(resolveTreePath(id))) {
        id = randomId()
    }
    return id
}

export const TreeRepo = {
    async create() {
        let tree = {
            id: await getUniqueId(),
            nodes: [],
            createdAt: new Date(),
            modifiedAt: new Date()
        }
        await this.save(tree)
        return tree
    },
    async save(tree) {
        tree.modifiedAt = new Date()
        let path = resolveTreePath(tree.id)
        let jsonEncodedTree = JSON.stringify(tree)
        await fs.writeFile(path, jsonEncodedTree, { encoding: "utf8" })
        return true
    },
    async get(id) {
        let path = resolveTreePath(id)
        if (!(await fileExists(path))) {
            return null
        }
        let jsonEncodedTree = await fs.readFile(path, { encoding: "utf8" })
        return JSON.parse(jsonEncodedTree)
    },
    async access(id) {
        let path = resolveTreePath(id)
        return await fileExists(path)
    }
}
