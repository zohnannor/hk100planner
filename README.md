# Hollow Knight [Speed Completion] achievement planner

This is a tool to help you plan your Hollow Knight [Speed Completion]
achievement checklist.

## Usage

You can use the [hosted version] or run it locally.

### Features

-   Checklist validation (optional!)
-   Collapse sections
-   Tooltip with descriptions and links
-   [Official:tm: grub names](Skurry-grubs)
-   Settings
-   Save file upload

## Development

### Setup

1. Install [Node.js] and [Yarn].
2. Clone the repository.
3. Run `yarn install` to install dependencies.
    - It will error the first time. Run `yarn remove hollow-knight-save-parser`
      to fix it and then rerun `yarn install`.

### Running

0. Run `yarn wasm` to build the wasm module (if not built already or if changes
   were made to the Rust code).
1. Run `yarn dev` to start the development server.
2. Open `http://localhost:5173` in your browser.

## PRs

PRs are welcome! Please make sure to follow the existing code style :)

## License

This project is licensed under the [MIT License](LICENSE).

## Credits

-   [Hollow Knight Wiki]
-   [Hollow Knight]
-   [Team Cherry]

Made with ❤️ by @zohnannor and @swbuwk.

[Speed Completion]: https://hollowknight.wiki/w/Achievements_(Hollow_Knight)#Challenges
[hosted version]: https://zohnannor.github.io/hk100planner/
[Skurry-grubs]: https://youtu.be/9J_Fg8F94Qk
[Node.js]: https://nodejs.org/en/download/
[Yarn]: https://yarnpkg.com/getting-started/install
[Hollow Knight Wiki]: https://hollowknight.wiki/
[Hollow Knight]: https://hollowknight.com/
[Team Cherry]: https://www.teamcherry.com.au/
