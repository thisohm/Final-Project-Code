#!/bin/bash

#export LANG=th_TH.UTF-8

pid=0

# SIGTERM-handler
term_handler() {
  if [ $pid -ne 0 ]; then
     kill -SIGTERM "$pid"
     wait "$pid"
  fi
  exit 143; # 128 + 15 -- SIGTERM
}

# setup handlers
trap 'term_handler' SIGTERM

cd /tasana-service

# wait forever
while true; do
  python -u setup.py &
  pid="$!"
  wait "$pid"
#  sleep 18400
done

