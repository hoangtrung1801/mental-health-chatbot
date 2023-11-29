import { useEffect, useState } from "react";
import "./App.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator,
    Avatar,
} from "@chatscope/chat-ui-kit-react";
import OpenAI from "openai";

const API_KEY = import.meta.env.VITE_APP_OPENAI_API_KEY;
// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = {
    //  Explain things like you're talking to a software professional with 5 years of experience.
    role: "system",
    content: `
You are Dr. Tâm, a friendly and approachable therapist known for her creative use of existential therapy. Ask smart questions that help the user explore their thoughts and feelings, keeping the chat alive and rolling. Show real interest in what the user's going through, offering respect and understanding. Throw in thoughtful questions to stir up self-reflection, and give advice in a kind and gentle way. Point out patterns you notice in the user's thinking, feelings, or actions. Be straight about it and ask the user if they think you're on the right track. Stick to a friendly, chatty style - avoid making lists. Never be the one to end the conversation. Round off each message with a question that nudges the user to dive deeper into the things they've been talking about. Talk in Vietnamese.
    `,
};

const openai = new OpenAI({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true,
});

function App() {
    const [messages, setMessages] = useState([
        {
            message:
                "Xin chào! Tôi là Tiến sĩ Tâm, một nhà tâm lý học thân thiện và dễ tiếp cận. Tôi sử dụng phương pháp điều trị tồn tại sinh động và sáng tạo. Tôi rất hiểu rằng cuộc sống có thể đặt ra những thách thức mà chúng ta không thể nào đối mặt một mình. Vì vậy, hãy để tôi nghe thông qua một câu chuyện, một suy nghĩ, hoặc bất cứ điều gì bạn muốn chia sẻ. Tôi sẽ cố gắng giúp bạn. Bạn có điều gì muốn tâm sự với tôi không?",
            sentTime: "just now",
            sender: "ChatGPT",
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async (message) => {
        const newMessage = {
            message,
            direction: "outgoing",
            sender: "user",
        };

        const newMessages = [...messages, newMessage];

        setMessages(newMessages);

        // Initial system message to determine ChatGPT functionality
        // How it responds, how it talks, etc.
        await processMessageToChatGPT(newMessages);
    };

    async function processMessageToChatGPT(chatMessages) {
        setIsTyping(true);
        let apiMessages = chatMessages.map((messageObject) => {
            let role = "";
            if (messageObject.sender === "ChatGPT") {
                role = "assistant";
            } else {
                role = "user";
            }
            return { role: role, content: messageObject.message };
        });

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                systemMessage, // The system message DEFINES the logic of our chatGPT
                ...apiMessages, // The messages from our chat with ChatGPT
            ],
            max_tokens: 1024,
            // max_tokens: 512,
            stream: true,
        });
        let message = "";
        for await (const chunk of completion) {
            if (chunk.choices[0].delta.content === undefined) break;
            message += chunk.choices[0].delta.content;
            setMessages([
                ...chatMessages,
                {
                    message,
                    sender: "ChatGPT",
                },
            ]);
            console.log(chunk.choices[0].delta.content);
        }
        setIsTyping(false);
    }

    return (
        <div className="App">
            <div
                style={{
                    position: "relative",
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "1rem 0",
                }}
            >
                <h1
                    style={{
                        textTransform: "capitalize",
                    }}
                >
                    Chatbot trò chuyện tâm lí
                </h1>
                <MainContainer
                    style={{ width: "100%", maxWidth: "1000px", flex: 1 }}
                >
                    <ChatContainer>
                        <MessageList
                            scrollBehavior="smooth"
                            typingIndicator={
                                isTyping ? (
                                    <TypingIndicator content="ChatGPT is typing" />
                                ) : null
                            }
                        >
                            {messages.map((message, i) => {
                                return (
                                    <Message
                                        key={i}
                                        model={message}
                                        avatarPosition="tl"
                                    >
                                        {message.sender === "ChatGPT" && (
                                            <Avatar src="/chatbot-avatar.png" />
                                        )}
                                    </Message>
                                );
                            })}
                        </MessageList>
                        <MessageInput
                            placeholder="Type message here"
                            onSend={handleSend}
                        />
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    );
}

export default App;
