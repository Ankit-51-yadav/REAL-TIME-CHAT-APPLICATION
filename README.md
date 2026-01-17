## REAL-TIME-CHAT-APPLICATION

*COMPANY*: CODTECH IT SOLUTIONS

*NAME*: ANKIT YADAV

*INTERN ID*: CTIS0916

*DOMAIN*: FRONTEND WEB DEVELOPMENT

*DURATION*: 4 WEEKS

*MENTOR*: NEELA SANTOSH

## DESCRIPTION

*Real-Time WebSocket Chat Application *

This is a modern, responsive real-time chat application frontend built using React.js, the WebSocket API, and Tailwind CSS. The project focuses on creating a production-ready user interface with smooth real-time interactions, efficient message handling, and customizable themes. It demonstrates practical frontend skills required for building real-time applications.

Features
Real-Time Chat

The application supports instant real-time messaging using WebSockets. Multiple users can participate in conversations with automatically generated usernames. Each message includes a timestamp, and the chat automatically scrolls to the most recent message to maintain a smooth user experience.

Message Management

Users can edit or delete only their own messages. Messages can be edited by double-clicking on them, and edited messages are clearly marked to maintain transparency in conversations. Keyboard shortcuts improve usability, allowing users to save edits with the Enter key or cancel editing with the Escape key.

User Interface and Experience

The application includes light and dark mode themes for better accessibility and personalization. Each user is represented with a dynamically generated gradient avatar. A sidebar displays the contact list, and messages from the selected contact are visually highlighted. Smooth animations and transitions enhance the overall experience, and the layout is fully responsive across devices.

Smart Behaviors

The chat application displays typing indicators to show when another user is composing a message. Users can clear the chat history with a confirmation step to prevent accidental data loss. Messages are persisted using localStorage so chat history remains available after page refresh. Duplicate messages are prevented to ensure clean conversations.

Tech Stack

React.js is used for building the user interface. The WebSocket API enables real-time communication. Tailwind CSS provides modern styling and responsive design. LocalStorage is used for client-side message persistence, and Vite is used for fast development and optimized builds.

Project Structure

src
Chat.jsx
App.jsx
main.jsx
index.css

How It Works

When the application loads, a random username is generated. The client connects to a WebSocket server to send and receive messages in real time. Messages are managed using React state and saved in localStorage. The interface updates instantly without page reloads, and message editing and deletion are restricted to the original sender.

## OUTPUT

HOME (LIGHT MODE)
<img width="1502" height="882" alt="Image" src="https://github.com/user-attachments/assets/7acbdb4b-a2c3-43f5-af66-a630a184a9e5" />

DARK MODE
<img width="1501" height="876" alt="Image" src="https://github.com/user-attachments/assets/82bf149f-7230-4253-98cf-976157f3cf58" />

CONTACT SECTION
<img width="1442" height="826" alt="Image" src="https://github.com/user-attachments/assets/ff45d214-1f65-4595-a327-750d78adb288" />

EDIT MESSAGE
<img width="1453" height="842" alt="Image" src="https://github.com/user-attachments/assets/db1c2edd-35d1-4979-96dd-a2af8f9b1e7b" />

CLEAR CHAT
<img width="1692" height="895" alt="Image" src="https://github.com/user-attachments/assets/d8c911cd-7852-42fa-a83b-de1d22015851" />

INITIAL SCREEN
<img width="1457" height="845" alt="Image" src="https://github.com/user-attachments/assets/5aa20ce0-f8ea-45f9-bec5-e157d2f3561f" />


