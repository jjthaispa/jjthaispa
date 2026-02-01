#!/bin/bash

# Trigger the 'firebase-schedule-updateReviews-us-east1' job
echo "Triggering Cloud Scheduler job: firebase-schedule-updateReviews-us-east1..."

gcloud scheduler jobs run firebase-schedule-updateReviews-us-east1 \
  --location=us-east1 \
  --project=jjthaispa

if [ $? -eq 0 ]; then
  echo "Job triggered successfully!"
else
  echo "Failed to trigger job."
  exit 1
fi
