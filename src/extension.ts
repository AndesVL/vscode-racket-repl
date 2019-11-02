import * as vscode from 'vscode';
import { REPLManager, set_file_permission} from "./replManager";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	//Manages terminal and REPL.
	const manager = new REPLManager();

	//Register run command
	let run = vscode.commands.registerTextEditorCommand('racket-repl.run', (editor: vscode.TextEditor) => {
		const filepath: String = editor.document.fileName;

		//Start REPL
		manager.run(filepath);
		// Display a message box to the user containing the filename.
		vscode.window.showInformationMessage('Running: ' + filepath.substr(filepath.lastIndexOf('/') + 1));
	});

	//Register stop command
	let stop = vscode.commands.registerCommand('racket-repl.stop', () => {
		//Stop REPL
		manager.stop();
	});

	//Set file permissions for scripts
	set_file_permission();

	context.subscriptions.push(run);
}

// this method is called when your extension is deactivated
export function deactivate() { }
