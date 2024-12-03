import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  useEffect(() => {
    if (user) {
      const tasksRef = collection(db, "tasks");
      onSnapshot(tasksRef, (snapshot) => {
        setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });
    }
  }, [user]);

  const handleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const addTask = async () => {
    if (newTask.title) {
      await addDoc(collection(db, "tasks"), newTask);
      setNewTask({ title: "", description: "" });
    }
  };

  const updateTask = async (taskId, updatedTask) => {
    await updateDoc(doc(db, "tasks", taskId), updatedTask);
  };

  const deleteTask = async (taskId) => {
    await deleteDoc(doc(db, "tasks", taskId));
  };

  return (
    <div className="p-4">
      {!user ? (
        <button
          onClick={handleSignIn}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Sign in with Google
        </button>
      ) : (
        <div>
          {/* Task input */}
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="border p-2 w-full mb-2"
          />
          <textarea
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="border p-2 w-full mb-2"
          />
          <button
            onClick={addTask}
            className="bg-green-500 text-white p-2 rounded w-full"
          >
            Add Task
          </button>
          {/* Task list */}
          <ul className="mt-4">
            {tasks.map((task) => (
              <li key={task.id} className="border-b p-2">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                {/* Update and Delete buttons */}
                <button
                  onClick={() => updateTask(task.id, task)}
                  className="text-blue-500 mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
