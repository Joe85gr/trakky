#!/bin/bash -e

cd trakky-client
npm ci
npm run build --if-present
npm run lint