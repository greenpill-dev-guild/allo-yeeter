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
echo Running Script: $DEPLOYER_SCRIPT...

# Run the script with interactive inputs
forge script script/$DEPLOYER_SCRIPT \
    --chain sepolia \
    --rpc-url $SEPOLIA_RPC_URL \
    --broadcast \
    --verify \
    -vvvv \
    --private-key $DEPLOYER_PRIVATE_KEY
# $args
