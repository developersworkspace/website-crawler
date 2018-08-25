import { app, BrowserWindow } from 'electron';
import * as path from 'path';

function createWindow() {
  let window = new BrowserWindow({ width: 800, height: 600 });

  window.setMenu(null);

  // TODO: Remove
  window.webContents.openDevTools();

  window.loadFile(`${path.join(__dirname, 'index.html')}`);

  window.on('closed', () => {
    window = null;
  });
}

app.on('ready', createWindow);
