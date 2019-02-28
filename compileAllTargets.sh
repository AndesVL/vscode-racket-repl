#!/bin/sh

#requires rust cross tool
cross build --target x86_64-unknown-linux-gnu --release
cross build --target x86_64-pc-windows-gnu --release
#TODO mac not supported by cross
#cross build --target-dir ./out --target x86_64-apple-darwin 

#move folders to out directory
mv ./target/x86_64-pc-windows-gnu/release/vscode-racket-repl.exe ./out/launch_windows.exe
mv ./target/x86_64-unknown-linux-gnu/release/vscode-racket-repl ./out/launch_linux
#mv ./target/x86_64-apple-darwin/debug/vscode-racket-repl ./out/launch_mac
