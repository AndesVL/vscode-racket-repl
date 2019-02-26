"use strict";
import * as vscode from "vscode";

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

        const dir = fileUri.path.substring(0, fileUri.path.lastIndexOf("/")); //drop first "/" in windows paths: /c...
        const file = fileUri.path.substring(fileUri.path.lastIndexOf("/") + 1);

        //Rust program "launch" launches Racket REPL and cleans up terminal
        this._terminal.sendText(`cd ${__dirname}`);
        this._terminal.sendText(`./launch ${dir} ${file}`);

        //Focus terminal.
        this._terminal.show(true);
    }

    //Stops the REPL in the given terminal (defaults to running terminal).
    public async stop(terminal: vscode.Terminal = this._terminal) {
        terminal.hide();
        const pid = await terminal.processId;
        const exec = require('child_process').exec;
        exec(`kill -9 ${pid}`); //kill terminal process using SIGKILL
    }

    //Stop REPL when object gets disposed.
    dispose() {
        this.stop();
    }
}