//const translit = require("./transliteration");
const usb = require('usb');

import { Message } from './interfaces';

// You can find ids in "Device Manager" -> "Properties"
const aVID = 9025;
const aPID = 579;
const aInterface = 1;
const aOutEndpoint = 0;
const aInEndpoint = 1;

let arduinoEndpoint;

/*
  -= Only on Windows =-
  Must be installed the WinUSB driver (use the Zadig program)
  On Windows 10 you should enter "Safe Mode" or use console commands like
    "bcdedit.exe -set loadoptions DISABLE_INTEGRITY_CHECKS"
    "bcdedit.exe -set TESTSIGNING ON"
    to enable "Test Mode" to install driver
  To disable "Test Mode" use "bcdedit.exe -set TESTSIGNING OFF" command
  Terminal must be elevated
*/
export function initArduino() {
  const arduino = usb.findByIds(aVID, aPID);
  arduino.open();
  const arduinoInterface = arduino.interfaces[aInterface];
  // USB port can be busy, so we free them
  if (arduinoInterface.isKernelDriverActive) {
    try {
      arduinoInterface.detachKernelDriver();
    } catch (err) {}
  }
  arduinoInterface.claim();
  arduinoEndpoint = arduinoInterface.endpoints[aOutEndpoint];
  arduinoEndpoint.transferType = usb.LIBUSB_TRANSFER_TYPE_BULK;
}

function divide(str: string, n: number): string[] {
  return str.match(RegExp(`.{1,${n}}`, 'gm'))!.map(x => x + '\0');
}

function send(str: string): void {
  arduinoEndpoint.transfer(str, function (err: string) {
    console.log(err != undefined ? err : `[TRANSFERRED] ${str}`);
  });
}

// LINE_HEIGHT was determined in *.ino project
const DISPLAY_WIDTH = 128;
const DISPLAY_HEIGHT = 64;
const LINES_ON_SCREEN = 3;
const TIMEOUT = 5000; // ms (1s = 1000ms)

let timer: NodeJS.Timer;

export function transfer(msg: Message, page: number) {
  const pages = Math.ceil(msg.content.length / LINES_ON_SCREEN);
  send(`${msg.sendTime}\0`);
  send(`${msg.author}\0`);
  send(`${page + 1}/${pages}\0`);
  for (let j = page * LINES_ON_SCREEN; j < (page + 1) * LINES_ON_SCREEN && j < msg.content.length; j++)
    send(msg.content[j]);
}

export function sendMessage(msg: Message) {
  msg.content = divide(msg.rawContent, 20);
  clearInterval(timer);
  cycle(msg);
}

function cycle(msg: Message) {
  const pages = Math.ceil(msg.content.length / LINES_ON_SCREEN);
  if (pages > 1) {
    let page = 0;
    timer = setInterval(() => {
      transfer(msg, page);
      page++
      if (page == pages) page = 0;
    }, TIMEOUT);
  } else {
    transfer(msg, 0); 
  }
}