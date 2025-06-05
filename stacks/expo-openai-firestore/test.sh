#!/bin/bash
npm install
npx expo export:web
test -d dist && echo "Expo build passed." || exit 1
