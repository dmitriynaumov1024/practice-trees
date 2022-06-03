export function onDocumentLoad (callback) {
  document.onreadystatechange = () => {
    if (document.readyState == "complete") callback()
    else window.onload = () => callback() 
  }  
}

export function find (selector) {
  return document.querySelector(selector)
}

export function findAll (selector) {
  return document.querySelectorAll(selector)
}
