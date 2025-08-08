# Pancreatic Health Chatbot Demo Guide

## Quick Start

### 1. Start the Backend Server
```bash
cd Pan-Backend
mvn spring-boot:run
```
The server will start on `http://localhost:8080`

### 2. Start the Frontend Application
```bash
cd PanInsight
npm run dev
```
The application will start on `http://localhost:3000`

### 3. Access the Chatbot
1. Open your browser and navigate to `http://localhost:3000/PanInsight`
2. You'll see the PanInsight homepage
3. Look for the floating chat button in the bottom-right corner (blue/purple gradient)
4. Click the chat button to open the chatbot interface

## Testing the Chatbot

### Valid Pancreatic Health Questions
Try these questions to test the domain-specific functionality:

1. **Basic Questions:**
   - "What is the pancreas?"
   - "What are the symptoms of pancreatic cancer?"
   - "How does the pancreas produce insulin?"

2. **Disease-Related:**
   - "What is pancreatitis?"
   - "What are the risk factors for pancreatic cancer?"
   - "How is diabetes related to the pancreas?"

3. **Treatment Questions:**
   - "What is the Whipple procedure?"
   - "How are pancreatic enzymes used in treatment?"
   - "What are the treatment options for pancreatic cancer?"

4. **Symptom Questions:**
   - "What causes jaundice in pancreatic disease?"
   - "Why does pancreatic cancer cause weight loss?"
   - "What are the early warning signs of pancreatic problems?"

### Greeting Tests
The chatbot should respond to general greetings:
- "Hello"
- "Hi there"
- "How are you?"
- "Good morning"

### Off-Topic Tests
These should trigger the fallback message:
- "What's the weather like?"
- "Tell me a joke"
- "What's the capital of France?"
- "How do I cook pasta?"

## Expected Behavior

### ✅ Correct Responses
- Pancreatic health questions should receive detailed, educational responses
- Greetings should receive a friendly welcome message
- All responses should emphasize consulting healthcare professionals
- Responses should be informative and supportive

### ❌ Fallback Responses
- Off-topic questions should receive: "Sorry, I can only answer questions related to pancreatic health. Please ask me about pancreatic diseases, symptoms, treatments, or general pancreatic health information."

### 🔄 Loading States
- When sending a message, you should see animated dots indicating the AI is processing
- The send button should be disabled during processing

## API Testing

### Test the Backend Directly
You can test the API endpoint directly using curl or Postman:

```bash
curl -X POST http://localhost:8080/api/chat/ask \
  -H "Content-Type: application/json" \
  -d '{"message": "What are the symptoms of pancreatic cancer?"}'
```

### Health Check
```bash
curl http://localhost:8080/api/chat/health
```

## Troubleshooting

### Common Issues

1. **Chatbot not responding:**
   - Check if backend server is running on port 8080
   - Verify DeepInfra API key is valid
   - Check browser console for errors

2. **CORS errors:**
   - Ensure backend CORS configuration includes frontend URL
   - Check that credentials are properly configured

3. **API errors:**
   - Verify the DeepInfra API key in `application.properties`
   - Check backend logs for detailed error messages

4. **UI not displaying:**
   - Ensure React component is properly imported
   - Check for TypeScript compilation errors
   - Verify Tailwind CSS is loaded

### Debug Steps

1. **Backend Debug:**
   ```bash
   cd Pan-Backend
   mvn spring-boot:run
   ```
   Watch the console for any error messages.

2. **Frontend Debug:**
   ```bash
   cd PanInsight
   npm run dev
   ```
   Open browser developer tools and check the console.

3. **Network Debug:**
   - Open browser developer tools
   - Go to Network tab
   - Send a message and check the API request/response

## Sample Conversation

Here's an example conversation flow:

**User:** "Hello"
**Bot:** "Hello! I'm your pancreatic health assistant. I can help you with questions about pancreatic diseases, symptoms, treatments, and general pancreatic health. How can I assist you today?"

**User:** "What are the symptoms of pancreatic cancer?"
**Bot:** "Pancreatic cancer symptoms can include jaundice (yellowing of skin and eyes), abdominal or back pain, unexplained weight loss, loss of appetite, nausea and vomiting, fatigue, and digestive problems. However, these symptoms can also be caused by other conditions. It's important to consult with a healthcare professional for proper diagnosis and evaluation."

**User:** "What's the weather like?"
**Bot:** "Sorry, I can only answer questions related to pancreatic health. Please ask me about pancreatic diseases, symptoms, treatments, or general pancreatic health information."

## Performance Notes

- First API call may take 2-3 seconds as the AI model loads
- Subsequent calls should be faster
- The chatbot maintains conversation context within the session
- Messages are not stored permanently for privacy

## Security Features

- No permanent message storage
- Educational purpose only
- Medical disclaimers in responses
- Secure API key management
- CORS protection configured 