import { isString, isNumber, isObject, isArray } from "./safety.js"
import { find, findAll } from "./composition.js"

var treeMockup = [
  { parent: null, id: 0, text: "Root node" },
  { parent: 0, id: 1, text: "First child" },
  { parent: 2, id: 3, text: "Child of second child" },
  { parent: 0, id: 2, text: "Second child" },
  { parent: 0, id: 4, text: "Idk what is this" },
]


function Tree (options) {
  var _nodes = []

  var tree = { 
    get nodes () {
      return _nodes
    }
  }

  var _lastId = options.nodes
    .reduce((prev, item) => (item.id > prev) ? item.id : prev, 0) + 1

  var _onChangeCallbacks = []

  const _onChange = () => _onChangeCallbacks.forEach(f => f(tree))

  function TreeNode (options) {
    /*
      options: {
        id: Number,
        parent: Number,
        text: String
      }
    */
    options.ensureProp("id", isNumber).or(() => _lastId++)
    options.ensureProp("text", isString).or(`untitled#${options.id}`)

    var _text = options.text

    return {
      get id() {
        return options.id
      },
      get parent() {
        return options.parent
      },
      get text () {
        return _text
      },
      set text (value) {
        _text = value
        _onChange()
      }
    }
  }

  _nodes = options.nodes.map(item => TreeNode(item))
  
  function _removeRec (node) {

    var _bad = _nodes.filter(item => item.parent == node.id)
    _nodes = _nodes.filter(item => item.parent != node.id && item != node)

    for (var item of _bad) {
      _removeRec(item)
    }
  }

  // Add child to given parent node
  tree.addChild = (parent = { id: null }) => {
    _nodes.push(TreeNode({
      parent: parent.id
    }))
    _onChange()
  }
  
  // Remove given node
  tree.remove = (node) => {
    _removeRec(node)
    _onChange()
  }

  // Add a callback to respond to changes
  tree.useNodes = (callback) => {
    _onChangeCallbacks.push(callback) 
    callback(tree)
  }

  return tree
}

// Render a tree
function renderTree (tree, root) {
  // Make Dom Node id
  function makeDomNodeId (root, id) {
    return `${root}-${id}`
  }

  function createTreeItemView (node) {
    /* 
      node: TreeNode
    */
    var domNode = find("#tree-node-template")
      .content.cloneNode(true).children[0]

    domNode.id = makeDomNodeId(root.id, node.id)
    domNode.setAttribute("node-id", node.id)

    for (var el of domNode.children[0].children) {
      if (el.getAttribute("role") == "toggle-children") {
        el.onclick = (event) => {
          domNode.classList.toggle("show-children")
        }
      }
      if (el.getAttribute("role") == "text") {
        el.onchange = (event) => {
          node.text = event.target.value
        }
      }
      if (el.getAttribute("role") == "add-child") {
        el.onclick = (event) => {
          tree.addChild(node)
          domNode.classList.add("show-children")
        }
      }
      if (el.getAttribute("role") == "remove") {
        el.onclick = (event) => {
          tree.remove(node)
        }
      }
    }
    return domNode
  }

  function updateTreeItemView (node, domNode) {
    domNode.setAttribute("has-children", 
      !!tree.nodes.find(item => item.parent == node.id))

    for (var el of domNode.children[0].children) {
      if (el.getAttribute("role") == "text") {
        el.value = node.text
      }
    }
  }

  var unusedDomNodes = [...root.querySelectorAll(".c-tree-item")]
    .filter(el => !tree.nodes.find(node => node.id == el.getAttribute("node-id")))

  for (var el of unusedDomNodes) el.remove()
  
  // Tree is ordered in the way if previous element 
  // is son of next element, then they are swapped
  var nodesCopy = [...tree.nodes]
  nodesCopy.sort((a, b) => (a.parent == b.id) ? 1 : -1)
  .forEach(node => {
    var view = find(`#${makeDomNodeId(root.id, node.id)}`) ||
      createTreeItemView(node)
    updateTreeItemView(node, view)
    var parent = (node.parent == null) ? root : 
      find(`#${makeDomNodeId(root.id, node.parent)}>[role='children']`)
    parent.appendChild(view)
  }) 
}

export function useTrees (options) {
  /* 
  options: {
    root: DomElement
  }
  */
  if (!options.root) return
  var root = options.root

  var t = Tree({ 
    nodes: treeMockup 
  })

  t.useNodes((tree) => {
    renderTree(tree, root)
  })

  if(window) window.tree = t
}
