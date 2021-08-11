const { ipcRenderer } = require("electron")
const thresholdInput = document.getElementById('threshold')
const boostAmountInput = document.getElementById('boostAmount')

var boost = 10;
var threshold = 6;

const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
}

thresholdInput.onchange = () => {
    threshold = thresholdInput.value
    console.log('you have changed threshold to: ' + threshold);
    ipcRenderer.send('updateThreshold', threshold);
}

boostAmountInput.onchange = () => {
    boost = boostAmountInput.value
    console.log('you have changed boost amount to: ' + boost);
    ipcRenderer.send('updateBoost', boost);
}

ipcRenderer.on('clickSpeed', (event, arg) => {
    replaceText('clickSpeed', 'clickspeed: ' + arg + ' Click/s')
})
ipcRenderer.on('withoutBoost', (event, arg) => {
    replaceText('withoutBoost', 'withoutBoost: ' + arg)
})
ipcRenderer.on('currentBoost', (event, arg) => {
    replaceText('currentBoost', 'currentBoost: ' + arg)
})
ipcRenderer.send('startStop', true)