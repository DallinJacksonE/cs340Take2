#--------------Update Shared and Dependency in Server ----------------

cd ../tweeter-shared && npm run build

cd ../tweeter-server

# 1. Remove the node_modules
rm -rf layer/nodejs/node_modules

# 2. Make sure dependencies are okay
npm i
cp -rL node_modules layer/nodejs/node_modules

# 3. Clean up the copied folder to keep your layer size small (SAM has a 250MB limit)
rm -rf layer/nodejs/node_modules/tweeter-shared/node_modules
rm -rf layer/nodejs/node_modules/tweeter-shared/src


# --------------Deply-----------------

echo "Starting Deployment"

npm run build

sam build

sam deploy

echo "Finished Deployment"
