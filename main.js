const setupEvents = require('./installers/setupEvents');
if (setupEvents.handleSquirrelEvent()) {
  return;
}

const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
let win;

function createWindow () {
  win = new BrowserWindow({width: 800, height: 600});
  
  console.log(process.env.HOST)
  if (process.env.NODE_ENV === 'development'){
    win.loadURL(process.env.HOST);
    win.webContents.openDevTools();
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('windows-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});
