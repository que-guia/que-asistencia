const setupEvents = require('./installers/setupEvents');
if (setupEvents.handleSquirrelEvent()) {
  return;
}

const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
let win;

function createWindow () {
  // mainWindow = new BrowserWindow({
  //   titleBarStyle: 'hidden',
  //   width: 1281,
  //   height: 800,
  //   minWidth: 1281,
  //   minHeight: 800,
  //   show: true,
  //   // icon: path.join(__dirname, 'assets/icons/png/64x64.png')
  // });
  //
  // mainWindow.loadURL(`file://${__dirname}/dist/index.html`);

  win = new BrowserWindow({width: 800, height: 600});
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  }));

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
