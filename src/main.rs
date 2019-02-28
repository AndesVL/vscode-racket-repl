use std::env;
use std::process::{Command, Stdio};

//Launches a Racket REPL in a cleared terminal.
//main takes two arguments: the Racket-file to run and its working directory
fn main() {
        let args: Vec<String> = env::args().collect();
        let file = &args[2];
        let dir = &args[1];

        //Clears the terminal
        let _clear = Command::new("clear").spawn();

        //Start the REPL
        Command::new("racket")
                .current_dir(dir)
                .stdin(Stdio::inherit())
                .stdout(Stdio::inherit())
                .stderr(Stdio::inherit())
                .arg("-i")
                .arg("-e")
                .arg(format!(
                        "(require xrepl)(dynamic-enter! (symbol->string (quote {})))",
                        file
                ))
                .output()
                .expect("Unable to launch racket");
}
