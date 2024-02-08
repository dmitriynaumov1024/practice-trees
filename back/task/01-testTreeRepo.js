import "dotenv/config"

import { TreeRepo } from "../src/common/TreeRepo.js"

let tree = await TreeRepo.create()

tree.nodes.push({ text: "Hello world" , nodes: [ ] })

await TreeRepo.save(tree)

console.log(await TreeRepo.get(tree.id))

console.log(await TreeRepo.access(tree.id))
