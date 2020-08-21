# POC of using Supervisor inside docker container

## About Supervisor
Home page: http://supervisord.org

Features:
- manages pool of apps defined in [configuration file](http://supervisord.org/configuration.html)
- can work as foreground process, not daemon - required for Docker container
- can automatically restart app depending on its configuration
- can detect if application stopped immediately (even with code 0), mainly due of startup error - allows to define minimum working time 
  of application to be considered as RUNNING.
- handles signals properly - terminates all processes by SIGTERM (it seems to be configurable),
  and listens for signal itself - allow to gracefully terminate processes
- has [XML-RPC interface](http://supervisord.org/api.html) and provides Python client library to interact with it
- allows to define [event listener](http://supervisord.org/events.html), able to react on specific events
- seems to have good community with many [plugins](http://supervisord.org/plugins.html)

## Usage
### Starting:
```sh
$ docker-compose up
```

### Logs:
```sh
$ docker-compose logs -f supervisord-demo
```

### Stopping container (gracefully):
```sh
$ docker-compose down
```

### Force shutdown single app with REST API (should gracefully shutdown whole container):
```sh
curl --request POST "http://localhost:8080/stop" \
     --header 'Content-Type: application/json' \
     -d '{ "exitCode": 1, "delay": 2000 }'
```
Or using provided script:
```sh
./demo/stop.sh 8080 1 2000
```
(arguments: `port exitCode delay`)


### Force log some text to console
```sh
curl --request POST "http://localhost:8080/log/{level}" \
     --header 'Content-Type: text/plain' \
     -d 'message'
```
where level is one of following: `error`, `warn`, `info`, `debug`, `trace`.

Using provided script:
```sh
./demo/log.sh 8080 'message' info
```
(arguments: `port message level`)


## Contents

### supervisord.conf
Configuration file for Supervisor ([documentation](http://supervisord.org/configuration.html)).
Defines:
 - `inet_http_server` with XML-RPC interface to control Supervisor.
   Works on `127.0.0.1:9001` with credentials `test:test`.
 - Two supervised apps (see below)
 - Event listener (see below)
 - Logs from Supervisord and event listener are written in /var/log/supervisor directory
   (it must be created manually when running outside of docker).

### python_tools/shutdown_listener.py
Example event listener, terminates whole Supervisor tree when one of processes closes itself.

### node_apps
Two simple Node.JS apps which are supervised. Both have simple REST API, running on ports 8080 and 8081.
These apps also listen for SIGINT/SIGTERM and finishes with small delay to emulate shutdown logic.

#### Ping
```
GET /ping
```
Returns always `200 OK` with body `OK` - may be used as health check.

#### Stop
```
POST /stop

{
  "exitCode": 1,
  "delay": 1000
}
```
Schedules stopping with `exitCode` in `delay` ms. Both `exitCode` and `delay` are optional. Default:
```
{
  "exitCode": 0,
  "delay": 10
}
```

### Logs
```
POST /logs/{level}
Content-Type: text/plain

{message}
```
Logs given `message` to STDOUT with `level`, where `level` is one of: `error`, `warn`, `info`, `debug`, `trace`.
