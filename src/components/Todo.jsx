import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [deadline, setDeadline] = useState();
  const [error, setError] = useState("");

  const tasksRef = collection(db, "tasks");

  useEffect(() => {
    const q = query(tasksRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().userId === auth.currentUser.uid) {
          tasksData.push({ ...doc.data(), id: doc.id });
        }
      });
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    if (taskInput.trim() === "") {
      setError("Task input cannot be empty");
      setTimeout(() => setError(""), 3000); // Clear error after 5 seconds
      return;
    }
    await addDoc(tasksRef, {
      text: taskInput,
      priority,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
      deadline: deadline ? deadline.toISOString() : null,
    });
    setTaskInput("");
    setDeadline(null);
    setError("");
  };

  const deleteTask = async (id) => {
    const taskDoc = doc(db, "tasks", id);
    await deleteDoc(taskDoc);
  };

  const logout = () => {
    signOut(auth);
  };

  return (
    <div className="container mx-auto w-11/12 pt-16">
      <div className="flex justify-between mb-16 ">
        <h1 className="text-3xl font-mono">To-Do List</h1>
        <Button
          onClick={logout}
          variant="destructive"
          className="text-black bg-transparent border-focus hover:border-hover hover:bg-accent w-32"
        >
          Logout
        </Button>
      </div>
      <div className="flex justify-between gap-3 mb-4">
        <div className="flex gap-3 w-10/12">
          <Input
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Enter a new task"
            className="px-4 py-2 border rounded w-3/6"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-1/6 px-2 py-1 rounded border border-input focus:border-focus focus:outline-none focus:ring-0 hover:bg-accent hover:text-accent-foreground"
          >
            <option>Low</option>
            <option>Normal</option>
            <option>High</option>
          </select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="ml-2 w-2/6 justify-start text-left font-normal focus:border-focus focus:outline-none focus:ring-0 data-[state=open]:border-focus hover:border-input rounded transition"
              >
                {deadline ? format(deadline, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={deadline}
                onSelect={setDeadline}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          onClick={addTask}
          className="px-4 py-2 bg-focus text-white rounded hover:bg-focus transition w-2/12"
        >
          Add Task
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
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
                {task.deadline && (
                  <span className="text-sm text-gray-500 ml-2">
                    Deadline: {new Date(task.deadline).toLocaleDateString()}
                  </span>
                )}
              </span>
              <Button
                onClick={() => deleteTask(task.id)}
                variant="destructive"
                className="px-2 py-1 ml-2 bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </Button>
            </li>
          ))}
      </ul>
    </div>
  );
};
export default Todo;
