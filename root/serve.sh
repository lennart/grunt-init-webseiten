#!/bin/sh
touch devel/error.log
touch devel/access.log
(grunt serve) &
server=$!
(grunt listen)&
listener=$!
(tail -f devel/error.log)&
error_log=$!
(tail -f devel/access.log)&
access_log=$!
wait $listener
wait $server
wait $error_log
wait $access_log