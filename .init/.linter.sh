#!/bin/bash
cd /home/kavia/workspace/code-generation/furniture-store-online-43677-43689/furniture_shopping_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

