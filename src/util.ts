"use strict";

export function get_dir(filepath: String, sep: string): String {
    return filepath.substring(0, filepath.lastIndexOf(sep));
}

export function get_file(filepath: String, sep: string): String {
    return filepath.substring(filepath.lastIndexOf(sep) + 1);
}

export function make_do_once(action: (arg: any) => void): (arg: any) => void {
    var first = true;
    return (arg: any) => {
        if (first) {
            action(arg);
            first = false;
        }
    }
}