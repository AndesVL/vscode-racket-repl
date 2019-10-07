# Racket REPL

This extensions allows for Racket files to be run within Racket's REPL from Visual Studio Code's editor.

![Logo](./images/logo.png)

## Features

Run (or stop) the REPL using the buttons in the editor-title bar.
The REPL launches in the integrated VSCode terminal (emulating DrRacket's repl).

## Requirements

Racket needs to be installed and added to the shell's path.

## Known bugs
1. On mac, the first run may glitch out. 
   Simply run it again to permanently fix (untill the next extension update).
   (This is a javascript async issue in my workarround to fix impersistent x-permission. Can somebody, who owns a mac, fix this? thx ;P)
