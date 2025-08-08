# Pancreatic Health Chatbot

## Overview

The Pancreatic Health Chatbot is a domain-specific AI assistant integrated into the PanInsight application, designed to provide educational information about pancreatic diseases, symptoms, treatments, and general pancreatic health. The chatbot is powered by the DeepInfra API using the Mixtral-8x7B-Instruct-v0.1 model.

## Features

### Core Functionality
- **Domain-Specific Responses**: Only answers questions related to pancreatic health
- **Educational Focus**: Provides informative content about pancreatic anatomy, diseases, and treatments
- **Greeting Support**: Responds to general greetings and introductions
- **Fallback Messages**: Politely redirects off-topic questions to pancreatic health topics

### User Interface
- **Floating Chat Button**: Always accessible from the homepage
- **Mobile-Friendly Design**: Responsive interface that works on all devices
- **Real-time Messaging**: Instant message exchange with typing indicators
- **Dark/Light Theme Support**: Adapts to the application's theme
- **Smooth Animations**: Professional UI with smooth transitions

### Technical Features
- **RESTful API**: Clean `/api/chat/ask` endpoint
- **Error Handling**: Graceful error handling with user-friendly messages
- **Loading States**: Visual feedback during AI processing
- **Message History**: Maintains conversation context within the session

## Architecture

### Backend (Spring Boot)
- **Controller**: `ChatbotController` - Handles HTTP requests
- **Service**: `ChatbotServiceImpl` - Business logic and AI integration
- **DTOs**: `ChatRequest` and `ChatResponse` - Data transfer objects
- **API Integration**: DeepInfra API with Mixtral model

### Frontend (React + TypeScript)
- **Component**: `PancreaticChatbot` - Main chat interface
- **State Management**: Local state for messages and UI
- **API Communication**: Fetch API for backend communication
- **Styling**: Tailwind CSS with responsive design

## API Endpoints

### POST `/api/chat/ask`
Sends a message to the chatbot and receives an AI-generated response.

**Request Body:**
```json
{
  "message": "What are the symptoms of pancreatic cancer?"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message processed successfully",
  "data": {
    "message": "Pancreatic cancer symptoms can include...",
    "timestamp": "14:30",
    "isUserMessage": false
  }
}
```

### GET `/api/chat/health`
Health check endpoint for the chatbot service.

## Configuration

### Environment Variables
- `deepinfra.api.key`: DeepInfra API key (default: T6mO0cJP2w9E4JfhjSIfYYYtpRi4dKSp)

### System Prompt
The chatbot uses a specialized system prompt to ensure domain-specific responses:
```
You are a specialized medical AI assistant focused exclusively on pancreatic health and diseases. 
You provide accurate, educational information about pancreatic anatomy, diseases, symptoms, treatments, and general pancreatic health. 
Always emphasize that you provide educational information only and recommend consulting healthcare professionals for medical advice. 
Keep responses clear, informative, and supportive. Focus on pancreatic-related topics only.
```

## Pancreatic Health Keywords

The chatbot recognizes a comprehensive list of pancreatic health-related keywords including:
- Anatomy: pancreas, pancreatic duct, islet cells, beta cells, alpha cells
- Diseases: pancreatic cancer, pancreatitis, diabetes, pancreatic cysts
- Symptoms: jaundice, abdominal pain, weight loss, nausea, vomiting
- Treatments: pancreatic surgery, whipple procedure, pancreatic enzymes
- Related organs: gallbladder, liver, spleen, stomach, duodenum

## Usage Examples

### Valid Questions
- "What are the symptoms of pancreatic cancer?"
- "How does the pancreas produce insulin?"
- "What is chronic pancreatitis?"
- "What are the risk factors for pancreatic cancer?"
- "How is pancreatic cancer diagnosed?"

### Greetings
- "Hello"
- "Hi there"
- "How are you?"
- "Good morning"

### Off-topic Questions (Will be redirected)
- "What's the weather like?"
- "Tell me a joke"
- "What's the capital of France?"

## Security and Privacy

- **No Data Storage**: Chat messages are not stored permanently
- **Educational Purpose**: All responses emphasize educational nature
- **Medical Disclaimer**: Always recommends consulting healthcare professionals
- **API Security**: Secure API key management

## Testing

The chatbot includes comprehensive tests covering:
- Greeting message handling
- Pancreatic health question processing
- Off-topic question filtering
- Error handling scenarios

Run tests with:
```bash
mvn test -Dtest=ChatbotServiceTest
```

## Future Enhancements

Potential improvements for the chatbot:
- Message history persistence
- User authentication integration
- Advanced conversation context
- Multi-language support
- Voice input/output
- Integration with medical databases
- Symptom assessment questionnaires

## Troubleshooting

### Common Issues

1. **Chatbot not responding**
   - Check if the backend server is running
   - Verify DeepInfra API key is valid
   - Check network connectivity

2. **Off-topic responses**
   - Ensure the system prompt is properly configured
   - Verify keyword filtering is working
   - Check API response parsing

3. **UI not displaying**
   - Verify React component is imported correctly
   - Check for JavaScript console errors
   - Ensure Tailwind CSS is loaded

### Debug Endpoints
- `GET /api/chat/health` - Check service status
- Check browser developer tools for frontend errors
- Monitor backend logs for API issues

## Contributing

When contributing to the chatbot:
1. Maintain domain-specific focus
2. Update keyword lists as needed
3. Test with various question types
4. Ensure medical accuracy and disclaimers
5. Follow existing code patterns and styling 