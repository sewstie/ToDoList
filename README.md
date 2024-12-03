To-Do List Chrome Extension

A lightweight and user-friendly Chrome extension that helps users manage their tasks efficiently. Built with React, Tailwind CSS, and Firebase, this extension allows users to add, view, update, and delete tasks directly from their browser.

Features
Task Management
Add, view, update, and delete tasks seamlessly.

Firebase Integration

Authentication: Secure login using Firebase Authentication (Email/Password or Google Login).
Firestore: Real-time database to sync tasks across devices.
Notifications
Reminds users of upcoming tasks or deadlines using Chrome's notification API.

Offline Support
View and update tasks offline, syncing changes once reconnected.

Modern UI
Responsive and stylish interface designed with Tailwind CSS.

Tech Stack
Frontend: React, Tailwind CSS
Backend: Firebase (Firestore, Authentication)
Chrome APIs: Extensions API, Notifications API
Installation
Clone the repository

bash
Copy code
git clone https://github.com/your-username/todo-list-extension.git
cd todo-list-extension
Install dependencies

bash
Copy code
npm install
Set up Firebase

Go to Firebase Console.
Create a project and enable Firestore and Authentication.
Replace the Firebase configuration in src/firebase.js with your project details.
Build the extension

bash
Copy code
npm run build
Load in Chrome

Go to chrome://extensions.
Enable Developer Mode.
Click Load unpacked and select the dist folder.
Usage
Add a Task

Open the extension by clicking the icon in the Chrome toolbar.
Enter the task details and click "Add Task."
Manage Tasks

View all tasks in the list.
Click on a task to edit or delete it.
Get Notifications

Enable Chrome notifications to receive reminders for deadlines.
File Structure
php
Copy code
.
├── public/
│ ├── icon.png # Extension icon
│ ├── manifest.json # Chrome extension configuration
├── src/
│ ├── components/
│ │ ├── TaskCard.jsx # Individual task UI component
│ │ ├── TaskList.jsx # Displays a list of tasks
│ │ ├── AddTaskForm.jsx # Form to add new tasks
│ ├── firebase.js # Firebase configuration
│ ├── index.css # Tailwind CSS styles
│ ├── main.jsx # Entry point for the React app
├── package.json # Project dependencies
└── vite.config.js # Build configuration
Roadmap
Add sorting and filtering for tasks.
Include priority levels and deadlines.
Improve offline functionality.
Submit the extension to the Chrome Web Store.
Contributing
Contributions are welcome! Feel free to fork this repository and submit pull requests.

License
This project is licensed under the MIT License. See the LICENSE file for details.
