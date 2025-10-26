// Configuration file for Question Paper Repository
module.exports = {
    // Server Configuration
    port: process.env.PORT || 3001,
    
    // Gemini AI API Configuration
    geminiApiKey: process.env.GEMINI_API_KEY || 'AIzaSyCc3BQ8OTd4nRKw_YgEO9V983FgAJDarKY',
    geminiApiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    
    // Database Configuration
    databaseUrl: process.env.VERCEL_DATABASE_URL || null,
    
    // Security Configuration
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // File Upload Configuration
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    
    // AI Configuration
    aiConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024
    }
};
