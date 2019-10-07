"use strict";
import * as vscode from "vscode";
const os = require('os');
const path = require('path');

const sep = path.sep;
const os_type = os.platform();

export class REPLManager implements vscode.Disposable {
    private _terminal: vscode.Terminal;

    constructor() {
        this._terminal = this.init_terminal();
    }

    //Instantiate a new REPL terminal.
    private init_terminal(): vscode.Terminal {
        return vscode.window.createTerminal("Racket");
    }

    //Runs the REPL using the current file.
    public async run(filepath: String) {

        //Always run in a new terminal (I found no other way to close the Racket shell)
        //Stop the old terminal
        this.stop(this._terminal);
        //Create a new terminal
        this._terminal = this.init_terminal();

        var dir: String = filepath.substring(0, filepath.lastIndexOf(sep));
        const file: String = filepath.substring(filepath.lastIndexOf(sep) + 1);

        //Start the REPL.
        this.launch(dir, file);

        //Focus terminal.
        this._terminal.show(false);
    }

    //Stops the REPL in the given terminal (defaults to running terminal).
    public async stop(terminal: vscode.Terminal = this._terminal) {
        terminal.hide();
        const pid = await terminal.processId;
        //On windows and linux/mac require a different kill method.
        switch (os_type) {
            case 'win32': {
                const kill = require('tree-kill');
                kill(pid);
                return;
            }
            default: {
                const exec = require('child_process').exec;
                exec(`kill -9 ${pid}`); //kill terminal process using SIGKILL
            }
        }
    }

    //Stop REPL when object gets disposed.
    dispose() {
        this.stop();
    }

    //Launches the REPL script.
    //Each OS has a different script for their respective default shell.
    private launch(dir: String, file: String) {
        var launcher: String;
        switch (os_type) {
            case 'win32': launcher = './launch_windows.bat'; break;
            case 'linux': launcher = 'sh launch_linux'; break;
            case 'darwin': launcher = './launch_mac'; break;
            default: {
                vscode.window.showErrorMessage(`Your operating system: ${os_type}, is not yet supported.`);
                return;
            }
        }

        this._terminal.sendText(`cd ${__dirname}`); //scripts are stored in "out" folder
        this._terminal.sendText(`./${launcher} ${dir} ${file}`);
    }
}