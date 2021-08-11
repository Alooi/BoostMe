// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')
const { ipcMain } = require('electron')
var robot = require("robotjs");
const mouseEvents = require("global-mouse-events");
var CPS;
var boost = 10;
var currentBoost = 0;
var threshold = 6;
var timer = 0;
clicksHistory = [];
var timerID;
var boostEnabled = false;
timerStarted = false;
function count(){
    timer = timer + 0.1
}

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 400,
    backgroundColor: 'grey',
    icon: path.join(__dirname, 'ui/images/1075178_small500.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('ui/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('startStop', (event, arg) => {
  if (arg){
    mouseEvents.on("mouseup", event => {
        clicksHistory.push(timer)
        startTimer();
        CPS = getCPS()
        // console.log('withoutboost: ' + (CPS - currentBoost))
        // console.log('with boost: ' + (CPS))
        if (CPS - currentBoost > threshold){
            boostbaby(boost);
        }
    });
    
    function startTimer(){
        if (!timerStarted){
            // console.log("timer STARTED")
            timerStarted = true;
            timerID = setInterval(count, 100);
        }
    }
    
    function getCPS(){
        const result = clicksHistory.filter(click => click > timer - 1);
        return result.length
    }
    
    function boostbaby(amount){
        if (!boostEnabled){
            // console.log('BOOST BABY!!')
            boostEnabled = true;
            currentBoost = amount;
            var currentAmount = 0;
            segments = 1000 / amount;
            const intervalID = setInterval(function(){
                if (amount > currentAmount){
                    robot.mouseClick()
                    currentAmount++;
                } else {
                    clearInterval(intervalID);
                    boostEnabled = false;
                    currentBoost = 0;
                }
            }, segments);
        }
    }
    responder = setInterval(() => {
      CPS = getCPS()
      event.reply('withoutBoost', (CPS - currentBoost))
      event.reply('clickSpeed', (CPS))
      event.reply('currentBoost', currentBoost)
    },34)
  } else {
    // console.log("timer STOPPED")
    clearInterval(timerID);
    clearInterval(responder);
    timer = 0;
    clickcounter = 0;
    timerStarted = false;
  }
})

ipcMain.on('updateThreshold', (event,arg) => {
  threshold = arg;
})

ipcMain.on('updateBoost', (event,arg) => {
  boost = arg;
})