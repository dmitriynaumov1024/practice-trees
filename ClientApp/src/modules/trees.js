import axios from "axios"
import { isString, isNumber, isObject, isArray } from "./safety.js"
import { find, findAll } from "./composition.js"


function Tree (options) {

  var _id = options.id
  var _nodes = []
  
  var tree = { 
    get id () {
      return _id 
    },
    get nodes () {
      return _nodes
    }
  }

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
    options.ensureProp("text", isString).or(`untitled#${options.id}`)

    var _nodeid = options.id
    var _text = options.text

    return {
      get id() {
        return _nodeid
      },
      get parent() {
        return options.parent
      },
      get text () {
        return _text
      },
      set text (value) {
        var fail = value.fail
        if (typeof(value) == "object") value = value.value
        axios({
          method: "post",
          url: "/api/treenode/edit.php",
          data: {
            tree: _id,
            id: _nodeid,
            newtext: value
          }
        })
        .then(r => {
          if (r.data.success) {
            _text = value
            _onChange()
          }
          else {
            if (typeof(fail) == "function") fail()
          }
        })
        .catch(e => {
          console.warn(e)
          if (typeof(fail) == "function") fail()
        })
      }
    }
  }

  _nodes = options.nodes.map(item => TreeNode(item))

  // Add child to given parent node
  tree.addChild = (parent = { id: null }) => {
    var defaultText = "Untitled node"
    axios({
      method: "post",
      url: "/api/treenode/create.php",
      data: { 
        parent: parent.id, 
        tree: _id,
        text: defaultText
      }
    })
    .then(r => {
      if (r.data.success) {
        _nodes.push(TreeNode({
          parent: parent.id,
          id: r.data.id,
          text: defaultText
        }))
        _onChange()
      }
      else {
        window.alert(r.data.message || "Unknown error")
      }
    })
  }
  
  // Remove given node
  tree.remove = (node) => {
    axios({
      method: "post",
      url: "/api/treenode/remove.php",
      data: { 
        id: node.id, 
        tree: _id 
      }
    })
    .then(r => {
      if (r.data.success) {
        _nodes = r.data.nodes.map(item => TreeNode(item))
        _onChange()
      }
      else {
        window.alert(r.data.message || "Unknown error")
      }
    })
  }

  // Register a callback to respond to changes
  tree.useNodes = (callback) => {
    _onChangeCallbacks.push(callback) 
    callback(tree)
  }

  return tree
}

// Render a tree
function renderTree (tree, root) {

  // DECLARE SOME FUNCTIONS

  // Make Dom Node id
  function makeDomNodeId (root, id) {
    return `${root}-${id}`
  }

  // Create Tree item view
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
          node.text = { 
            value: event.target.value,
            fail: () => event.target.value = node.text
          }
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

  // Update existing Tree item view
  function updateTreeItemView (node, domNode) {
    domNode.setAttribute("has-children", 
      !!tree.nodes.find(item => item.parent == node.id))

    for (var el of domNode.children[0].children) {
      if (el.getAttribute("role") == "text") {
        el.value = node.text
      }
    }
  }

  // Create a view for empty tree
  function createEmptyTreeView () {
    var domNode = find("#empty-tree-template")
      .content.cloneNode(true).children[0]
    
    domNode.querySelector("[role='create']").onclick = () => {
      tree.addChild()
    }

    return domNode
  }

  // If tree is empty, display a button to create root node
  if (!tree.nodes || !tree.nodes.length) {
    console.log("empty tree")
    root.innerHTML = ""
    root.appendChild (createEmptyTreeView())
    root.setAttribute("state", "empty")
    return
  }

  if (root.getAttribute("state") == "empty" || root.innerText) {
    root.innerHTML = ""
    root.removeAttribute("state")
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
    treeId: Number,
    root: DomElement
  }
  */
  if (!options.root) return
  var root = options.root

  var t = undefined
  
  var promise = (options.treeId) ? 
    axios ({
      method: "get",
      url: "/api/treenode/getall.php",
      params: { tree: options.treeId }
    }) :
    axios ({
      method: "get",
      url: "/api/tree/create.php"
    })

  promise.then(r => {
    if (! r.data) {
      return
    }
    if (r.data.success) { 
      console.log(r.data)
      console.log("success!")
      t = Tree ({
        id: r.data.id || options.treeId,
        nodes: r.data.nodes || []
      })
      t.useNodes((tree) => {
        renderTree(tree, root)
      })
    }
    else {
      root.innerHTML = r.data.message || 
        "Unknown error while trying to find existing tree"
      return 
    }
  })

}
