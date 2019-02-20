import * as vscode from 'vscode';
import { REPLManager } from "./replManager";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	//Manages terminal and REPL.
	const manager = new REPLManager();

	//Register run command
	let run = vscode.commands.registerCommand('racket-repl.run', (fileUri) => {
		//Start REPL
		manager.run(fileUri);
		// Display a message box to the user containing the filename.
		vscode.window.showInformationMessage('Running: ' + fileUri.path.substr(fileUri.path.lastIndexOf('/') + 1));
	});

	//Register stop command
	let stop = vscode.commands.registerCommand('racket-repl.stop', () => {
		//Stop REPL
		manager.stop();
	});

	context.subscriptions.push(run);
}

// this method is called when your extension is deactivated
export function deactivate() { }
