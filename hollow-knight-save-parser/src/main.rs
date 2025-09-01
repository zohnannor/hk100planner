use std::{env, fs};

use hollow_knight_save_parser::Parser;

fn main() {
    let Some(path) = env::args().nth(1) else {
        println!("Usage: cargo run -- <file>");
        return;
    };
    let Ok(data) = fs::read(&path) else {
        println!("Failed to read file `{path}`");
        return;
    };
    println!("Parsing save file `{path}`");
    let mut parser = Parser::new();
    if parser.parse_save_file(&data).is_err() {
        println!("Failed to parse save file");
        return;
    }
    let map = parser.get_map();
    println!("{map:#?}");
}
