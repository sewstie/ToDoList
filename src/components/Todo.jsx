// src/components/Todo.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [priority, setPriority] = useState("Normal");

  const tasksRef = collection(db, "tasks");

  useEffect(() => {
    const q = query(tasksRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData = [];
      querySnapshot.forEach((doc) => {
        // Ensure only tasks belonging to the current user are fetched
        if (doc.data().userId === auth.currentUser.uid) {
          tasksData.push({ ...doc.data(), id: doc.id });
        }
      });
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    if (taskInput.trim() === "") return;
    await addDoc(tasksRef, {
      text: taskInput,
      priority,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
      deadline: null, // Placeholder for deadlines
    });
    setTaskInput("");
  };

  const updateTask = async (id, updatedFields) => {
    const taskDoc = doc(db, "tasks", id);
    await updateDoc(taskDoc, updatedFields);
  };

  const deleteTask = async (id) => {
    const taskDoc = doc(db, "tasks", id);
    await deleteDoc(taskDoc);
  };

  const logout = () => {
    signOut(auth);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">My To-Do List</h1>
        <button
          onClick={logout}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
      <div className="flex mb-4">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          className="flex-grow px-2 py-1 border rounded"
          placeholder="Enter a new task"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="ml-2 px-2 py-1 border rounded"
        >
          <option>Low</option>
          <option>Normal</option>
          <option>High</option>
        </select>
        <button
          onClick={addTask}
          className="ml-2 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Add
        </button>
      </div>
      <ul>
        {tasks
          .sort((a, b) => {
            const priorityOrder = { High: 1, Normal: 2, Low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          })
          .map((task) => (
            <li key={task.id} className="flex items-center mb-2">
              <span className="flex-grow">
                {task.text} - {task.priority}
              </span>
              {/* You can add buttons for updating deadlines or priorities here */}
              <button
                onClick={() => deleteTask(task.id)}
                className="px-2 py-1 bg-red-400 text-white rounded hover:bg-red-500 transition"
              >
                Delete
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Todo;
