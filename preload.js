// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

var ipc = require('electron').ipcRenderer;
const { ipcRenderer } = require("electron")

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }
  

  ipc.send('ping')
  ipc.on('ping', (arg) => {
      ipc.removeAllListeners('ping');
      replaceText('clickSpeed', arg.text);
  });
  })