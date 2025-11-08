#!/bin/bash

# Environment Variables Import Script for Vercel
# This script helps you import environment variables from a .env file

echo "🚀 Vercel Environment Variables Setup"
echo "======================================"

# Check if .env.production exists
if [ -f ".env.production" ]; then
    echo "✅ Found .env.production file"
    
    # Read the .env file and set each variable
    while IFS='=' read -r key value; do
        # Skip empty lines and comments
        if [[ ! -z "$key" && ! "$key" =~ ^[[:space:]]*# ]]; then
            # Remove any quotes from the value
            value=$(echo $value | sed 's/^"\(.*\)"$/\1/' | sed "s/^'\(.*\)'$/\1/")
            
            echo "Setting $key for production environment..."
            echo "$value" | vercel env add "$key" production
            
            echo "Setting $key for preview environment..."
            echo "$value" | vercel env add "$key" preview
            
            echo "Setting $key for development environment..."
            echo "$value" | vercel env add "$key" development
        fi
    done < .env.production
    
    echo "✅ Environment variables have been set!"
    echo "Run 'vercel env ls' to verify"
    
else
    echo "❌ .env.production file not found"
    echo "Please create .env.production with your environment variables first"
    echo "You can use .env.production.template as a reference"
fi