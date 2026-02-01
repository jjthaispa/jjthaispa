#!/bin/bash

# Trigger the 'firebase-schedule-syncReviews-us-east1' job
echo "Triggering Cloud Scheduler job: firebase-schedule-syncReviews-us-east1..."

gcloud scheduler jobs run firebase-schedule-syncReviews-us-east1 \
  --location=us-east1 \
  --project=jjthaispa-new

if [ $? -eq 0 ]; then
  echo "Job triggered successfully!"
else
  echo "Failed to trigger job. Please check permissions and project settings."
  exit 1
fi
