# MDLR Examples

My experiments using [mdlr-js](https://github.com/kootstra-rene/mdlr-js).

## Installation

### Preferred

Prerequisites:

- [docker](https://www.docker.com) installed
- docker-compose
- browser

### Work around

Prerequisites:

- [mdlr-js](https://github.com/kootstra-rene/mdlr-js) downloaded
- terminal
- browser

## Usage

### Preferred

- create project directory
- within project directory create user directory
- copy the docker-compose.yaml from mdlr-js to the project directory
- run `docker-compose up` from the project directory
- navigate in the browser to https://localhost:8443/code/mdlr/http/repl.html

### Workaround

- clone [mdlr-js](https://github.com/kootstra-rene/mdlr-js)
- open a terminal in the root of the project
- `find * | grep -E '(code|user).*\.js$' > ./file-cache`
- `sudo ./mdlr.sh cert=code/mdlr/http`
- navigate in the browser to https://localhost/code/mdlr/http/repl.html

### General

In chrome:

- `CTRL-o` to open a js file
- navigate to a js REPL file in your file system
- Magic
- Changes in the code on the left will be immediately reflected on the right
- save changes with `CTRL-s`

## License

Use the code the way you want at your own risk. It is not copyrighted.
