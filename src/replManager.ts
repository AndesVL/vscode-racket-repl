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

        const dir = fileUri.path.substring(1, fileUri.path.lastIndexOf("/")); //drop first "/" in windows paths: /c...
        const file = fileUri.path.substring(fileUri.path.lastIndexOf("/") + 1);

        //Enter working directory.
        this._terminal.sendText(`cd ${dir}`);
        this._terminal.sendText(`cd ${"/" + dir}`); //cheat to operate on both windows and bash shells (1 of of the cd's will fail)

        //Some cleanup.
        this._terminal.sendText('clear');

        //Run command in terminal.
        const xreplCmd = '(require xrepl)' //import additional terminal features
        const enterModuleCmd = `(dynamic-enter! (symbol->string (quote ${file})))` //enters the namespace of file
        const clearRunLineCmd = '(require ansi) (for-each display (list \"\\e[3A\" \"\\e[2M\"))'//clears the racket call in bash/cmd shell
        //uses ansi codes: (move-cursor-up 3) and (delte-lines 2)

        const runCmd = `racket -i -e \' ${xreplCmd} ${enterModuleCmd} ${clearRunLineCmd} \'`
        this._terminal.sendText(runCmd);

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