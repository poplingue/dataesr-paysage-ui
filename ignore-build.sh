#!/bin/bash

echo "VERCEL_ENV: $VERCEL_ENV"

if [[ "$VERCEL_ENV" == "production" ]] ; then
  # Set cypress variables
  export CYPRESS_ACCOUNT=$CYPRESS_ACCOUNT
  export CYPRESS_PASSWORD=$CYPRESS_PASSWORD

  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1;


else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
fi
