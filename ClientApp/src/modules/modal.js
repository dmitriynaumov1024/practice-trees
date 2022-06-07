import { find } from "./composition.js"
import { isNumber } from "./safety.js"

export function showInfoModal (options) {
  /* 
    options: {
      caption: String,
      text: String,
      yesText: String,
      timeout: Number
    }
  */
  var _resolve = undefined

  var modalWrapper = find(`[role="info-modal-wrapper"]`)
  modalWrapper.setAttribute("active", true)

  var promise = new Promise(resolve => {
    _resolve = (value) => {
      modalWrapper.removeAttribute("active")
      resolve(value)
    }
  })

  modalWrapper.querySelector(`[role="modal-close"]`).onclick = () => {
    _resolve(true)
  }

  modalWrapper.querySelector(`[role="modal-caption"]`)
    .innerText = options.caption || "Note"

  modalWrapper.querySelector(`[role="modal-content"]`)
    .innerText = options.text || "Sample text"

  var buttonYes = modalWrapper.querySelector(`[role="modal-yes"]`)
  buttonYes.innerText = options.yesText || "Dismiss"
  buttonYes.onclick = () => {
    _resolve(true)
  }

  var timerView = modalWrapper.querySelector(`[role="modal-timer"]`)
  if (isNumber(options.timeout) && options.timeout > 0 && options.timeout < 60) {
    var _seconds = Math.floor(options.timeout) 
    timerView.innerText = _seconds 
    var intervalId = setInterval (() => {
      _seconds -= 1
      timerView.innerText = _seconds 
      if (_seconds <= 0) _resolve(false)
    }, 1000)
    setTimeout (() => {
      clearInterval(intervalId)
    }, (options.timeout + 1) * 1000)
  }

  return promise
}

export function showConfirmationModal (options) {
  /* 
    options: {
      caption: String,
      text: String,
      yesText: String,
      noText: String,
      timeout: Number
    }
  */
  var _resolve = undefined

  var modalWrapper = find(`[role="confirmation-modal-wrapper"]`)
  modalWrapper.setAttribute("active", true)

  var promise = new Promise(resolve => {
    _resolve = (value) => {
      modalWrapper.removeAttribute("active")
      resolve(value)
    }
  })

  modalWrapper.querySelector(`[role="modal-close"]`).onclick = () => {
    _resolve(false)
  }

  modalWrapper.querySelector(`[role="modal-caption"]`)
    .innerText = options.caption || "Confirmation"

  modalWrapper.querySelector(`[role="modal-content"]`)
    .innerText = options.text || "Are you sure?"

  var buttonYes = modalWrapper.querySelector(`[role="modal-yes"]`)
  buttonYes.innerText = options.yesText || "Yes"
  buttonYes.onclick = () => {
    _resolve(true)
  }

  var buttonNo = modalWrapper.querySelector(`[role="modal-no"]`)
  buttonNo.innerText = options.noText || "No"
  buttonNo.onclick = () => {
    modalWrapper.removeAttribute("active")
    _resolve(false)
  }

  var timerView = modalWrapper.querySelector(`[role="modal-timer"]`)
  if (isNumber(options.timeout) && options.timeout > 0 && options.timeout < 60) {
    var _seconds = Math.floor(options.timeout) 
    timerView.innerText = _seconds 
    var intervalId = setInterval (() => {
      _seconds -= 1
      timerView.innerText = _seconds 
      if (_seconds <= 0) _resolve(false)
    }, 1000)
    setTimeout (() => {
      clearInterval(intervalId)
    }, (options.timeout + 1) * 1000)
  }

  return promise
}
