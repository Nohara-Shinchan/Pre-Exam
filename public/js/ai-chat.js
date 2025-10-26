// AI Chat Integration with Gemini API
class AIChat {
    constructor() {
        this.apiKey = 'AIzaSyCc3BQ8OTd4nRKw_YgEO9V983FgAJDarKY';
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.chatHistory = [];
        this.isLoading = false;
        this.testMode = true; // Set to true to test without API
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupQuickActions();
    }
    
    setupEventListeners() {
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-button');
        
        // Send message on button click
        sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Send message on Enter key
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Auto-resize input
        chatInput.addEventListener('input', () => {
            this.autoResizeInput(chatInput);
        });
    }
    
    setupQuickActions() {
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');
        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const prompt = btn.getAttribute('data-prompt');
                document.getElementById('chat-input').value = prompt;
                this.sendMessage();
            });
        });
    }
    
    autoResizeInput(input) {
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';
    }
    
    async sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
        
        if (!message || this.isLoading) return;
        
        // Clear input and disable send button
        chatInput.value = '';
        chatInput.style.height = 'auto';
        this.setLoadingState(true);
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            this.addMessage(response, 'ai');
        } catch (error) {
            console.error('AI Error:', error);
            this.addMessage('Sorry, I encountered an error. Please try again.', 'ai');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    async getAIResponse(message) {
        console.log('Getting AI response for:', message);
        
        // Test mode - provide immediate responses without API
        if (this.testMode) {
            return this.getTestResponse(message);
        }
        
        try {
            // First, try to search for relevant question papers
            let relevantPapers = [];
            try {
                const baseUrl = window.location.port === '5500' ? 'http://localhost:3001' : '';
                const searchResponse = await fetch(`${baseUrl}/api/ai-search`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query: message })
                });
                
                if (searchResponse.ok) {
                    const searchData = await searchResponse.json();
                    relevantPapers = searchData.papers || [];
                    console.log('Found papers:', relevantPapers.length);
                }
            } catch (error) {
                console.log('Search failed, continuing with AI response only:', error);
            }
            
            // Create context with found papers
            let papersContext = '';
            if (relevantPapers.length > 0) {
                papersContext = `\n\nRelevant question papers found in our database:\n`;
                relevantPapers.slice(0, 5).forEach((paper, index) => {
                    papersContext += `${index + 1}. ${paper.title} (${paper.subject}, ${paper.year}, ${paper.university || 'N/A'})\n`;
                });
            } else {
                papersContext = '\n\nNo specific question papers found in our database for this query.';
            }
            
            // Simplified prompt for better reliability
            const systemPrompt = `You are a helpful AI assistant for students. You help with academic questions, question papers, and study guidance. Be friendly and encouraging.

${papersContext}

User's question: ${message}`;
            
            console.log('Sending request to Gemini API...');
            
            const requestBody = {
                contents: [{
                    parts: [{
                        text: systemPrompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            };
            
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            
            console.log('Gemini API response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Gemini API error:', errorText);
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            console.log('Gemini API response data:', data);
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                let aiResponse = data.candidates[0].content.parts[0].text;
                
                // If we found papers, add them to the response
                if (relevantPapers.length > 0) {
                    aiResponse += `\n\n**Found ${relevantPapers.length} relevant question paper(s):**\n`;
                    relevantPapers.slice(0, 3).forEach((paper, index) => {
                        aiResponse += `• **${paper.title}** (${paper.subject}, ${paper.year})\n`;
                    });
                    if (relevantPapers.length > 3) {
                        aiResponse += `• And ${relevantPapers.length - 3} more...\n`;
                    }
                }
                
                return aiResponse;
            } else {
                console.error('No valid response from Gemini:', data);
                throw new Error('No response generated from AI');
            }
        } catch (error) {
            console.error('Error in getAIResponse:', error);
            
            // Provide a fallback response based on the message
            if (message.toLowerCase().includes('hi') || message.toLowerCase().includes('hello')) {
                return "Hello! 👋 I'm your AI assistant for question papers and academic help. I can help you find question papers, provide solutions, and answer study questions. What would you like to know?";
            } else if (message.toLowerCase().includes('help')) {
                return "I'm here to help! I can assist you with:\n\n• Finding question papers by subject, year, or university\n• Providing solutions to academic problems\n• Explaining concepts and topics\n• Suggesting study materials\n\nWhat specific help do you need?";
            } else {
                return "I'm having trouble connecting to the AI service right now, but I'm still here to help! You can ask me about question papers, academic topics, or study guidance. What would you like to know?";
            }
        }
    }
    
    addMessage(content, sender) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Format the message content
        const formattedContent = this.formatMessage(content);
        messageContent.innerHTML = formattedContent;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add to chat history
        this.chatHistory.push({ content, sender, timestamp: new Date() });
    }
    
    formatMessage(content) {
        // Convert line breaks to HTML
        let formatted = content.replace(/\n/g, '<br>');
        
        // Convert **text** to <strong>text</strong>
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Convert *text* to <em>text</em>
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Convert numbered lists
        formatted = formatted.replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>');
        formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
        
        // Convert bullet points
        formatted = formatted.replace(/^[-•]\s(.+)$/gm, '<li>$1</li>');
        formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        
        return `<p>${formatted}</p>`;
    }
    
    setLoadingState(loading) {
        this.isLoading = loading;
        const sendButton = document.getElementById('send-button');
        const chatInput = document.getElementById('chat-input');
        
        if (loading) {
            sendButton.disabled = true;
            sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            chatInput.disabled = true;
            this.showTypingIndicator();
        } else {
            sendButton.disabled = false;
            sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
            chatInput.disabled = false;
            this.hideTypingIndicator();
        }
    }
    
    showTypingIndicator() {
        const chatMessages = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-message';
        typingDiv.id = 'typing-indicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="typing-indicator">
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Method to clear chat history
    clearChat() {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = `
            <div class="message ai-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>Hello! I'm your AI assistant. I can help you find question papers, provide solutions, and answer academic questions. What would you like to know?</p>
                </div>
            </div>
        `;
        this.chatHistory = [];
    }
    
    // Method to get chat history
    getChatHistory() {
        return this.chatHistory;
    }
    
    // Test mode responses for debugging
    getTestResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
            return "Hello! 👋 I'm your AI assistant for question papers and academic help. I can help you find question papers, provide solutions, and answer study questions. What would you like to know?";
        } else if (lowerMessage.includes('help')) {
            return "I'm here to help! I can assist you with:\n\n• Finding question papers by subject, year, or university\n• Providing solutions to academic problems\n• Explaining concepts and topics\n• Suggesting study materials\n\nWhat specific help do you need?";
        } else if (lowerMessage.includes('math') || lowerMessage.includes('mathematics')) {
            return "Great! I can help you with mathematics question papers and solutions. What specific math topics are you looking for? For example:\n\n• Calculus problems\n• Algebra questions\n• Geometry solutions\n• Statistics help\n\nWhat would you like to work on?";
        } else if (lowerMessage.includes('physics')) {
            return "Physics is fascinating! I can help you with physics question papers and solutions. What physics topics interest you?\n\n• Mechanics\n• Thermodynamics\n• Electromagnetism\n• Quantum physics\n• Optics\n\nWhat specific area would you like help with?";
        } else if (lowerMessage.includes('chemistry')) {
            return "Chemistry help coming right up! I can assist with chemistry question papers and solutions. What chemistry topics do you need help with?\n\n• Organic chemistry\n• Inorganic chemistry\n• Physical chemistry\n• Analytical chemistry\n• Biochemistry\n\nWhat specific chemistry problems are you working on?";
        } else if (lowerMessage.includes('computer') || lowerMessage.includes('cs') || lowerMessage.includes('programming')) {
            return "Computer science is my specialty! I can help you with CS question papers and programming solutions. What computer science topics do you need help with?\n\n• Programming languages (Python, Java, C++, etc.)\n• Data structures and algorithms\n• Database systems\n• Web development\n• Machine learning\n\nWhat specific CS topics would you like to explore?";
        } else {
            return `Thanks for your message: "${message}"\n\nI'm here to help with academic questions, question papers, and study guidance. You can ask me about:\n\n• Specific subjects (math, physics, chemistry, computer science)\n• Question papers from different years or universities\n• Solutions to academic problems\n• Study tips and exam preparation\n\nWhat would you like to know?`;
        }
    }
}

// Debug functions
function toggleDebug() {
    const debugPanel = document.getElementById('debug-panel');
    const isVisible = debugPanel.style.display !== 'none';
    debugPanel.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
        updateDebugInfo();
    }
}

function updateDebugInfo() {
    const debugInfo = document.getElementById('debug-info');
    const aiChat = window.aiChat;
    
    debugInfo.innerHTML = `
        <strong>AI Chat Status:</strong><br>
        • Test Mode: ${aiChat.testMode ? 'ON' : 'OFF'}<br>
        • API Key: ${aiChat.apiKey ? 'Set' : 'Not Set'}<br>
        • API URL: ${aiChat.apiUrl}<br>
        • Chat History: ${aiChat.chatHistory.length} messages<br>
        • Loading: ${aiChat.isLoading ? 'Yes' : 'No'}<br>
        <br>
        <strong>Browser Info:</strong><br>
        • User Agent: ${navigator.userAgent}<br>
        • Online: ${navigator.onLine ? 'Yes' : 'No'}<br>
        • Protocol: ${window.location.protocol}<br>
        • Port: ${window.location.port}<br>
    `;
}

// Initialize AI Chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiChat = new AIChat();
    
    // Add debug info update on message send
    const originalSendMessage = window.aiChat.sendMessage.bind(window.aiChat);
    window.aiChat.sendMessage = function() {
        updateDebugInfo();
        return originalSendMessage();
    };
});
