import { onDocumentLoad, find, findAll } from "./modules/composition.js"
import { useTrees } from "./modules/trees.js"
import { showConfirmationModal } from "./modules/modal.js"

import axios from "axios"

window.axios = axios

onDocumentLoad (() => {
  find("#button-create-tree").onclick = function () {
    useTrees({
      root: find("#tree")
    })
  }

  find("#button-find-tree").onclick = function () {
    useTrees({
      root: find("#tree"),
      treeId: Number(find("#input-tree-id").value)
    })
  }
})

import "./css/style.css"
import "./css/theme.css"
import "./css/trees.css"
import "./css/modal.css"
