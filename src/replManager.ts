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

        const dir = fileUri.path.substring(1, fileUri.path.lastIndexOf("/")); //skip first "/"
        const file = fileUri.path.substring(fileUri.path.lastIndexOf("/") + 1);

        //Enter working directory.
        this._terminal.sendText(`cd ${dir}`);

        //Some cleanup.
        this._terminal.sendText('clear');

        //Run command in terminal.
        this._terminal.sendText(`racket -i -e \'(require xrepl) (dynamic-enter! (symbol->string (quote ${file})))\'`);

        //Focus terminal.
        this._terminal.show(true);
    }

    //Stops the REPL in the given terminal (defaults to running terminal).
    public async stop(terminal: vscode.Terminal = this._terminal) {
        terminal.hide();
        const kill = require("tree-kill");
        const pid = await terminal.processId;
        kill(pid);
    }

    //Stop REPL when object gets disposed.
    dispose() {
        this.stop();
    }
}