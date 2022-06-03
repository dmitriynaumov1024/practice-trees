import { onDocumentLoad, find, findAll } from "./modules/composition.js"
import { useTrees } from "./modules/trees.js"

onDocumentLoad (() => {
  useTrees({
    root: find("#tree")
  })
})

import "./css/style.css"
import "./css/theme.css"
import "./css/tree-style.css"
