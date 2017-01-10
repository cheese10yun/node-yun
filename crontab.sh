#!/bin/bash

echo 'start delete table info...';

curl -H "Content-Type: application/json" -X DELETE -d '
[
  {"test":"test"}
]
  ' http://localhost:3500/api/v1/crontab

echo 'success...';
