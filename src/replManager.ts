"use strict";
import * as vscode from "vscode";
import { win32 } from "path";
const os = require('os');

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
    public async run(fileUri: vscode.Uri) {

        //Always run in a new terminal (I found no other way to close the Racket shell)
        //Stop the old terminal
        this.stop(this._terminal);
        //Create a new terminal
        this._terminal = this.init_terminal();

        var dir: String = fileUri.path.substring(0, fileUri.path.lastIndexOf("/"));
        dir = this.formatPath(dir);
        const file: String = fileUri.path.substring(fileUri.path.lastIndexOf("/") + 1);

        //Start the REPL.
        this.launch(dir, file);

        //Focus terminal.
        this._terminal.show(true);
    }

    //Stops the REPL in the given terminal (defaults to running terminal).
    public async stop(terminal: vscode.Terminal = this._terminal) {
        terminal.hide();
        const pid = await terminal.processId;
        //On windows and linux require a different kill method.
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

    //Formats a filepath correctly.
    private formatPath(path: String): String {
        switch (os_type) {
            //On Windows systems, remove the first "/" in "/c:..."
            case 'win32': return path.substr(1, path.length);
            default: return path;
        }
    }

    //Launches the REPL script.
    //This is a Rust program which clears the current terminal and then launches the REPL.
    //Each OS has a different binary.
    private launch(dir: String, file: String) {
        var launcher: String;
        switch (os_type) {
            case 'win32': launcher = 'launch_windows.exe'; break;
            case 'linux': launcher = 'launch_linux'; break;
            default: {
                vscode.window.showErrorMessage(`Your operating system: ${os_type}, is not yet supported.`);
                return;
            }
        }
        //Rust program launches Racket REPL and cleans up terminal, this hides the "sendText" command
        this._terminal.sendText(`cd ${__dirname}`); //binaries are stored in "out" folder
        this._terminal.sendText(`./${launcher} ${dir} ${file}`);
    }
}