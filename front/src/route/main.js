import { defineRoutes } from "@lib/defineRoutes.js"

import index from "@/page/index.js"
import tree from "@/page/tree.js"

export default defineRoutes([
    { path: "/", component: index },
    { path: "/tree/:id", component: tree, props: { id: String } }
])
