// AI Chat Integration with Gemini API
class AIChat {
    constructor() {
        this.apiKey = null;
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.chatHistory = [];
        this.isLoading = false;
        this.testMode = false; // Set to true to test without API
        
        this.init();
    }
    
    async init() {
        this.setupEventListeners();
        this.setupQuickActions();
        await this.loadApiKey();
    }
    
    async loadApiKey() {
        try {
            const baseUrl = window.location.port === '5500' ? 'http://localhost:3000' : '';
            const response = await fetch(`${baseUrl}/api/config`);
            const data = await response.json();
            this.apiKey = data.geminiApiKey;
            console.log('API Key loaded successfully');
        } catch (error) {
            console.error('Failed to load API key:', error);
            this.testMode = true; // Fallback to test mode
        }
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
        if (this.testMode || !this.apiKey) {
            return this.getTestResponse(message);
        }
        
        try {
            // First, try to search for relevant question papers
            let relevantPapers = [];
            try {
                const baseUrl = window.location.port === '5500' ? 'http://localhost:3000' : '';
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
            const systemPrompt = `You are a helpful AI assistant for students. You help with academic questions, question papers, and study guidance. Be friendly and encouraging.\n\n${papersContext}\n\nUser's question: ${message}`;
            
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
                
                // If there are no papers available, inform the user clearly
                if (relevantPapers.length === 0) {
                    const noPapersNote = (window.app && Array.isArray(window.app.papers) && window.app.papers.length === 0)
                        ? "\n\nNote: We currently don't have any question papers in the repository. This website is in testing to support users. You can upload a paper or ask study questions!"
                        : "\n\nI couldn't find matching papers right now. You can upload one or ask for study help.";
                    aiResponse += noPapersNote;
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
                const testingNote = (window.app && Array.isArray(window.app.papers) && window.app.papers.length === 0)
                    ? " Also, there are currently no question papers in the repository as this website is in testing to support users. You can upload a paper or ask for study help."
                    : "";
                return "I'm having trouble connecting to the AI service right now, but I'm still here to help! You can ask me about question papers, academic topics, or study guidance. What would you like to know?" + testingNote;
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
            return "Hello! 👋 I'm your AI assistant specialized in BCA (Bachelor of Computer Applications) subjects. I can help you with Java programming, web technologies, database management, and other BCA topics. What would you like to know?";
        } else if (lowerMessage.includes('help')) {
            return "I'm here to help with BCA subjects! I can assist you with:\n\n• **Programming Languages**: Java, C, C++, Python\n• **Web Technologies**: HTML, CSS, JavaScript, PHP\n• **Database Management**: SQL, MySQL, Oracle\n• **Data Structures & Algorithms**\n• **Operating Systems**\n• **Computer Networks**\n• **Software Engineering**\n\nWhat specific BCA topic do you need help with?";
        } else if (lowerMessage.includes('java') || lowerMessage.includes('programming')) {
            return "Java programming is essential for BCA! I can help you with:\n\n• **Core Java**: OOPs, Inheritance, Polymorphism\n• **Advanced Java**: JDBC, Servlets, JSP\n• **Java Frameworks**: Spring, Hibernate\n• **Java Question Papers** from different universities\n• **Coding Solutions** and explanations\n• **Interview Preparation** for Java roles\n\nWhat specific Java topic would you like help with?";
        } else if (lowerMessage.includes('web') || lowerMessage.includes('html') || lowerMessage.includes('css') || lowerMessage.includes('javascript')) {
            return "Web technologies are crucial for BCA students! I can help you with:\n\n• **Frontend**: HTML5, CSS3, JavaScript, Bootstrap\n• **Backend**: PHP, Node.js, Python Django\n• **Frameworks**: React, Angular, Vue.js\n• **Database Integration**: MySQL, MongoDB\n• **Web Development Projects**\n• **Web Technology Question Papers**\n\nWhat specific web technology do you need help with?";
        } else if (lowerMessage.includes('database') || lowerMessage.includes('sql') || lowerMessage.includes('mysql')) {
            return "Database management is a core BCA subject! I can help you with:\n\n• **SQL Queries**: SELECT, INSERT, UPDATE, DELETE\n• **Database Design**: ER Diagrams, Normalization\n• **MySQL, Oracle, SQL Server**\n• **NoSQL Databases**: MongoDB, Cassandra\n• **Database Question Papers**\n• **Practical Database Projects**\n\nWhat specific database topic would you like help with?";
        } else if (lowerMessage.includes('data structure') || lowerMessage.includes('algorithm')) {
            return "Data structures and algorithms are fundamental for BCA! I can help you with:\n\n• **Data Structures**: Arrays, Linked Lists, Stacks, Queues\n• **Trees**: Binary Trees, AVL Trees, B-Trees\n• **Graphs**: BFS, DFS, Shortest Path\n• **Sorting Algorithms**: Quick Sort, Merge Sort, Heap Sort\n• **Algorithm Analysis**: Time and Space Complexity\n• **DSA Question Papers** and solutions\n\nWhat specific data structure or algorithm do you need help with?";
        } else if (lowerMessage.includes('operating system') || lowerMessage.includes('os')) {
            return "Operating systems are important for BCA students! I can help you with:\n\n• **Process Management**: Scheduling, Synchronization\n• **Memory Management**: Paging, Segmentation\n• **File Systems**: File allocation, Directory structure\n• **Deadlock**: Prevention, Avoidance, Detection\n• **OS Question Papers** from different universities\n• **Practical OS Concepts**\n\nWhat specific OS topic would you like help with?";
        } else if (lowerMessage.includes('network') || lowerMessage.includes('computer network')) {
            return "Computer networks are essential for BCA! I can help you with:\n\n• **Network Models**: OSI, TCP/IP\n• **Network Protocols**: HTTP, FTP, SMTP, DNS\n• **Network Security**: Cryptography, Firewalls\n• **Network Topologies**: LAN, WAN, MAN\n• **Network Question Papers**\n• **Practical Networking** concepts\n\nWhat specific networking topic do you need help with?";
        } else if (lowerMessage.includes('software engineering') || lowerMessage.includes('se')) {
            return "Software engineering is crucial for BCA students! I can help you with:\n\n• **SDLC**: Waterfall, Agile, Spiral models\n• **Software Testing**: Unit, Integration, System testing\n• **UML Diagrams**: Use case, Class, Sequence diagrams\n• **Project Management**: Planning, Estimation, Risk management\n• **SE Question Papers**\n• **Software Development** methodologies\n\nWhat specific software engineering topic would you like help with?";
        } else if (lowerMessage.includes('c programming') || lowerMessage.includes('c language')) {
            return "C programming is the foundation of BCA! I can help you with:\n\n• **Basic C**: Variables, Data types, Operators\n• **Control Structures**: Loops, Conditions\n• **Functions**: Recursion, Parameter passing\n• **Pointers**: Memory management, Dynamic allocation\n• **C Question Papers** and solutions\n• **C Programming Projects**\n\nWhat specific C programming topic do you need help with?";
        } else {
            return `Thanks for your message: "${message}"\n\nI'm your specialized BCA AI assistant! I can help you with:\n\n• **Programming**: Java, C, C++, Python\n• **Web Technologies**: HTML, CSS, JavaScript, PHP\n• **Database**: SQL, MySQL, Oracle\n• **Core Subjects**: DSA, OS, Networks, SE\n• **Question Papers** from various universities\n• **Practical Solutions** and explanations\n\nWhat specific BCA topic would you like help with?`;
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
