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
- `sudo ./mdlr.sh cert=code/mdlr/http`
- navigate in the browser to https://localhost/code/mdlr/http/repl.html

### General

In chrome:

- `CTRL-o` to open a js file
- navigate to a js REPL file in your file system
- Magic
- Changes in the code on the left will be immediately reflected on the right
- save changes with `CTRL-s`

## Linting

```Bash
docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:latest
```

Once your instance is up and running, [login](http://localhost:9000) using System Administrator credentials:

- login: admin
- password: admin

**Analyzing a Project**

Now that you're logged in to your local SonarQube instance, let's analyze a
project:

- Click the Create new project button.
- Give your project a Project key and a Display name and click the Set Up
  button.
- Under Provide a token, select Generate a token. Give your token a name, click
  the Generate button, and click Continue.
- Then run the sonar scanner:

```Bash
# sonar-scanner
docker run --network=host --rm -e SONAR_HOST_URL=http://localhost:9000 -e SONAR_LOGIN=<token> -v "$PWD:/usr/src" sonarsource/sonar-scanner-cli -Dsonar.projectKey=<projectkey>
```

After a while the results are available in your local SonarQube instance.

- Stop the container until you need it again: `docker stop sonarqube`
- Start is when you need it again: `docker start sonarqube`
- ... and run the scanner docker command again

## License

Use the code the way you want at your own risk. It is not copyrighted.
