#!/bin/bash

# #############################################################################
# A script to test the Tweeter API by registering a new user and then
# using the returned auth token to follow another user.
#
# Prerequisites:
#   - curl: command-line tool for transferring data with URLs
#   - jq: command-line JSON processor
#
# Usage:
#   1. Replace the API_ENDPOINT placeholder with your actual API Gateway URL.
#   2. Make the script executable: chmod +x generateNewUser.sh
#   3. Run the script: ./generateNewUser.sh
# #############################################################################

# --- Configuration ---
# IMPORTANT: Replace this with the "Invoke URL" from your AWS API Gateway stage.
API_ENDPOINT="https://ihjouw21yk.execute-api.us-east-1.amazonaws.com/prod"

# User details for registration
FIRST_NAME="Test"
LAST_NAME="User"
PASSWORD="Test"
USER_TO_FOLLOW="dj"
NUM_USERS_TO_CREATE=1
IMAGE_DIR="profile_images" # Directory containing profile pictures


# --- Script Execution ---

if [[ "$API_ENDPOINT" == "YOUR_API_GATEWAY_ENDPOINT_URL" ]]; then
    echo "ERROR: Please replace the 'YOUR_API_GATEWAY_ENDPOINT_URL' placeholder in the script with your actual API endpoint."
    exit 1
fi

# Check if the image directory exists and has files
if [ ! -d "$IMAGE_DIR" ] || [ -z "$(ls -A $IMAGE_DIR)" ]; then
    echo "ERROR: Image directory '$IMAGE_DIR' not found or is empty."
    exit 1
fi

for i in $(seq 1 $NUM_USERS_TO_CREATE)
do
  echo ""
  echo " Starting user flow ($i of $NUM_USERS_TO_CREATE)..."
  echo "--------------------------------------------------"

  # Generate a new random alias for each user
  ALIAS=$(uuidgen | cut -c1-6)

  # Find all image files in the directory
  IMAGE_FILES=("$IMAGE_DIR"/*)
  # Select a random image file from the directory
  RANDOM_IMAGE_FILE=${IMAGE_FILES[$RANDOM % ${#IMAGE_FILES[@]}]}
  # Base64 encode the selected image. Use '-w 0' for Linux to avoid line breaks.
  # For macOS, the equivalent is just 'base64'.
  IMAGE_B64=$(base64 -w 0 "$RANDOM_IMAGE_FILE")

  echo "Registering new user with alias: @$ALIAS"

  # 1. Register the new user
  # The '-s' flag makes curl silent. We pipe the output to jq for pretty-printing and extraction.
  REGISTER_RESPONSE=$(curl -s -X POST "$API_ENDPOINT/register" \
      -H "Content-Type: application/json" \
      -d '{
            "firstName": "'"$FIRST_NAME"'",
            "lastName": "'"$LAST_NAME"'",
            "alias": "'"$ALIAS"'",
            "password": "'"$PASSWORD"'",
            "userImageBytes": "'"$IMAGE_B64"'"
          }')

  # Extract the authentication token from the response object
  AUTH_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.authToken.token')

  echo "Registration complete."
  echo "   Auth Token Received: ${AUTH_TOKEN:0:8}..."
  echo ""

  # 2. Check if we got a token before proceeding
  if [ -z "$AUTH_TOKEN" ] || [ "$AUTH_TOKEN" == "null" ]; then
      echo "❌ ERROR: Failed to retrieve auth token from registration response."
      echo "Server Response:"
      echo "$REGISTER_RESPONSE" | jq .
      exit 1
  fi

  echo "Following user: @$USER_TO_FOLLOW"

  # 3. Use the extracted auth token to follow the user 'dj'
  # Note: The follow endpoint in your UserService expects 'token' and 'userToFollowAlias'
  FOLLOW_RESPONSE=$(curl -s -X POST "$API_ENDPOINT/follow" \
      -H "Content-Type: application/json" \
      -d '{
            "token": "'"$AUTH_TOKEN"'",
            "userToFollow": {
              "firstName": "dummy",
              "lastName": "dummy",
              "alias": "'"$USER_TO_FOLLOW"'",
              "imageUrl": "dummy"
            }
          }')

  echo "Follow request sent."
  echo "--------------------------------------------------"
  echo "Response from /follow endpoint:"
  echo "$FOLLOW_RESPONSE" | jq .
  echo ""
  echo "Flow for user @$ALIAS completed successfully!"

done
