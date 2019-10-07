"use strict";

export function get_dir(filepath: String, sep: string): String {
    return filepath.substring(0, filepath.lastIndexOf(sep));
}

export function get_file(filepath: String, sep: string): String {
    return filepath.substring(filepath.lastIndexOf(sep) + 1);
}