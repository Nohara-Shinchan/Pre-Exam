#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Question Paper Repository...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('📝 Creating .env file...');
    
    const envContent = `# Environment Variables for Question Paper Repository

# Server Configuration
PORT=3001

# Gemini AI API Configuration
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=AIzaSyCc3BQ8OTd4nRKw_YgEO9V983FgAJDarKY

# Database Configuration (for Vercel integration)
# VERCEL_DATABASE_URL=your_vercel_database_url_here

# Security Configuration
NODE_ENV=development
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
} else {
    console.log('✅ .env file already exists');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 Installing dependencies...');
    const { execSync } = require('child_process');
    try {
        execSync('npm install', { stdio: 'inherit' });
        console.log('✅ Dependencies installed successfully!');
    } catch (error) {
        console.error('❌ Failed to install dependencies:', error.message);
        process.exit(1);
    }
} else {
    console.log('✅ Dependencies already installed');
}

console.log('\n🎉 Setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Update your Gemini API key in the .env file');
console.log('2. Run: node server.js');
console.log('3. Open: http://localhost:3001');
console.log('\n📚 For more information, see CONFIGURATION.md');
