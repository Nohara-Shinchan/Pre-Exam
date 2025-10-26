#!/bin/bash
echo "Starting Question Paper Repository Server..."
echo ""
echo "Current directory: $(pwd)"
echo ""
echo "Installing dependencies..."
npm install
echo ""
echo "Starting server..."
node server.js
