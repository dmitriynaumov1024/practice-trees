import axios from "axios"
import { isString, isNumber, isObject, isArray, isFunction } from "./safety.js"
import { find, findAll } from "./composition.js"
import { showInfoModal, showConfirmationModal } from "./modal.js"

// Tree is main data structure here
function Tree (options) {

  var _id = options.id
  var _nodes = []
  var _modified = false
  var _message = undefined
  var _lastId = -1
  
  var _onChangeCallbacks = []
  var _manyRemoveConfirm = undefined
  var _rootRemoveConfirm = undefined

  var tree = { 
    get id () {
      return _id 
    },
    get nodes () {
      return _nodes
    },
    get modified () {
      return _modified
    },
    get message () {
      return _message
    }
  }

  const _onChange = () => _onChangeCallbacks.forEach(f => f(tree))

  // create tree node
  function TreeNode (options) {
    /*
      options: {
        id: Number,
        parent: Number,
        text: String
      }
    */
    options.ensureProp("id", id => isNumber(id) && !_nodes.find(n => n.id == id))
           .or(()=> _lastId++)

    options.ensureProp("text", isString)
           .or(`untitled#${options.id}`)

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
        if (_text == value) return
        _text = value
        _modified = true
        _onChange()
      },
      get hasChildren() {
        return !!_nodes.find(node => node.parent == this.id)
      }
    }
  }

  function _hasChildren (node) {
    return node.hasChildren
  }

  function _isRootNode (node) {
    return node.parent == null
  }

  function _removeRec (node) {
    var _bad = _nodes.filter(item => item.parent == node.id)
    _nodes = _nodes.filter(item => item.parent != node.id && item != node)

    for (var item of _bad) {
      _removeRec(item)
    }
  }

  function _removeIf (condition) {
    return (node) => { 
      if (condition) {
        _removeRec(node)
        _modified = true
        _onChange()
      } 
    }
  }

  _nodes = options.nodes
    .map(item => TreeNode(item))

  _lastId = options.nodes
    .reduce((prev, item) => item.id > prev ? item.id : prev, 0) + 1

  // Add child to given parent node
  tree.addChild = (parent = { id: null }) => {
    _nodes.push(TreeNode({
      parent: parent.id
    }))
    _modified = true
    _onChange()
  }
  
  // Remove given node
  tree.remove = (node) => {
    if (_isRootNode(node) && _rootRemoveConfirm) {
      _rootRemoveConfirm()
        .then(agree => { _removeIf(agree)(node); _lastId = 1 })
    }
    else if (_hasChildren(node) && _manyRemoveConfirm) {
      _manyRemoveConfirm()
        .then(agree => { _removeIf(agree)(node) })
    }
    else {
      _removeRec(node)
      _modified = true
      _onChange()
    }
  }

  // Flush unsaved changes
  tree.flush = () => {
    axios({
      method: "post",
      url: "api/tree/update.php",
      data: {
        id: _id,
        nodes: _nodes.map(n => ({
          id: n.id,
          parent: n.parent,
          text: n.text
        }))
      }
    })
    .then(r => {
      console.log(r.data)
      if (r.data.success) {
        _modified = false
        _message = undefined
        _onChange()
      }
      else {
        _message = r.data.message
        _onChange()
      }
    })
  }

  // Register a callback to respond to changes
  tree.useNodes = (callback) => {
    _onChangeCallbacks.push(callback) 
    callback(tree)
  }

  tree.useManyRemoveConfirm = (callback) => {
    if (isFunction(callback)) _manyRemoveConfirm = callback
  }

  tree.useRootRemoveConfirm = (callback) => {
    if (isFunction(callback)) _rootRemoveConfirm = callback
  }

  return tree
}

// Render a tree
function renderTree (tree, root) {

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

  // Update existing Tree item view
  function updateTreeItemView (node, domNode) {
    domNode.setAttribute("has-children", node.hasChildren)

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

  function createSavePromptView () {
    var domNode = find("#save-prompt-template")
      .content.cloneNode(true).children[0]
    
    domNode.querySelector(`[role="save"]`).onclick = () => {
      tree.flush()
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

  if (root.getAttribute("state") == "empty") {
    console.log("hard reset")
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

  if (tree.modified) {
    if (root.querySelector(`[role="save-prompt"]`)) return
    root.prepend(createSavePromptView())
  }
  else {
    root.querySelector(`[role="save-prompt"]`)?.remove()
  }

  if (tree.message) {
    showInfoModal({
      caption: "Note",
      text: tree.message,
      yesText: "Dismiss"
    })
  }
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
  
  var promise = (isNumber(options.treeId)) ? 
    axios ({
      method: "get",
      url: "/api/tree/get.php",
      params: { id: options.treeId }
    }) :
    axios ({
      method: "get",
      url: "/api/tree/create.php"
    })

  promise.then(r => {
    if (! r.data) {
      root.innerHTML = "Unknown error"
      return
    }
    if (r.data.success) { 
      console.log(r.data)
      console.log("success!")
      var t = Tree ({
        id: r.data.id || options.treeId,
        nodes: r.data.nodes || []
      })
      t.useNodes((tree) => {
        renderTree(tree, root)
      })
      t.useRootRemoveConfirm(() => showConfirmationModal({
        caption: "Dangerous action",
        text: "You are going to delete ALL nodes of this tree. "
          + "This action can not be undone. "
          + "Are you sure you want to do this?",
        yesText: "Yes, delete",
        noText: "Back to safety",
        timeout: 20
      }))
    }
    else {
      showInfoModal({ 
        caption: "Something went wrong",
        text: r.data.message || "Unknown error",
        yesText: "Dismiss"
      }) 
      return 
    }
  })

}
