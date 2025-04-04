#!/usr/bin/env bash

# Read the RPC URL
source .env

# Read script
# echo Which script do you want to run?
# read script
# DEPLOYER_SCRIPT=$1

# Read script arguments
# echo Enter script arguments, or press enter if none:
# read -ra args

# Run the script
echo Running Script: $DEPLOYER_SCRIPT_FACTORY...

# Run the script with interactive inputs
forge script script/$DEPLOYER_SCRIPT_FACTORY \
    --chain $DEPLOYER_CHAIN_NAME \
    --rpc-url $ALFAJORES_RPC_URL \
    --broadcast \
    --verify \
    -vvvv \
    --private-key $DEPLOYER_PRIVATE_KEY

# Run the script
echo Running Script: $DEPLOYER_SCRIPT_STRATEGY...

# Run the script with interactive inputs
forge script script/$DEPLOYER_SCRIPT_STRATEGY \
    --chain $DEPLOYER_CHAIN_NAME \
    --rpc-url $RPC_URL \
    --broadcast \
    --verify \
    -vvvv \
    --private-key $DEPLOYER_PRIVATE_KEY
