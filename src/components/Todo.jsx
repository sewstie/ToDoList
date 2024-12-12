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
import { Button, buttonVariants } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { Modal } from "./ui/modal";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from "./ui/table";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [deadline, setDeadline] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [sortCriteria, setSortCriteria] = useState("priority");
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setErrorMessage("Task input cannot be empty");
      setTimeout(() => setErrorMessage(""), 3000);
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
    setErrorMessage("");
  };

  const handleTaskInputChange = (e) => {
    const value = e.target.value;
    setTaskInput(value);

    if (value.length === 50) {
      setErrorMessage("Maximum characters reached");
    } else {
      setErrorMessage("");
    }
  };

  const deleteTask = async (id) => {
    const taskDoc = doc(db, "tasks", id);
    await deleteDoc(taskDoc);
  };

  const logout = () => {
    signOut(auth);
  };

  const handleDayClick = (date) => {
    const tasksOnSelectedDate = tasks.filter(
      (task) =>
        task.deadline &&
        new Date(task.deadline).toDateString() === date.toDateString()
    );
    setSelectedDateTasks(tasksOnSelectedDate);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto w-11/12 pt-16 overflow-x-hidden">
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
      <div className="flex justify-between gap-3">
        <div className="flex flex-col mb-1 w-10/12">
          <div className="flex gap-3">
            <Textarea
              value={taskInput}
              onChange={handleTaskInputChange}
              placeholder="Enter a new task"
              className="px-4 py-2 border rounded w-3/6"
              maxLength={50}
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
          <p
            className={`text-red-500 text-sm my-2 ${
              errorMessage ? "opacity-100" : "opacity-0"
            }`}
          >
            {errorMessage || "Task input cannot be empty"}
          </p>
        </div>
        <Button
          onClick={addTask}
          className="px-4 py-2 bg-focus text-white rounded hover:bg-focus transition w-2/12"
        >
          Add Task
        </Button>
      </div>
      <div className="flex justify-between mb-4">
        <Button
          onClick={() => setIsCalendarView(!isCalendarView)}
          className="px-4 py-2 bg-focus text-white rounded hover:bg-focus transition w-1/6"
        >
          {isCalendarView ? "List View" : "Calendar View"}
        </Button>
        <div className="flex gap-4">
          <Button
            onClick={() => setSortCriteria("priority")}
            className="border-focus hover:border-hover bg-transparent text-black hover:bg-accent"
          >
            Sort by Priority
          </Button>
          <Button
            onClick={() => setSortCriteria("deadline")}
            className="border-focus hover:border-hover bg-transparent text-black hover:bg-accent"
          >
            Sort by Deadline
          </Button>
        </div>
      </div>

      {isCalendarView ? (
        <div className="flex justify-center">
          <Calendar
            tasks={tasks}
            onDayClick={handleDayClick}
            className="w-full h-auto"
            classNames={{
              cell: "h-16 w-16 text-center text-lg p-0 relative",
              weekday: "text-lg font-semibold text-center", // Increase size of day names
              day: cn(
                buttonVariants({ variant: "ghost" }),
                "h-16 w-16 p-0 font-normal text-foreground bg-transparent border border-transparent focus:border-focus focus:outline-none hover:border-focus"
              ),
              nav_button: cn(
                buttonVariants({ variant: "outline" }),
                "h-12 w-12 bg-transparent p-0 opacity-50 hover:opacity-100"
              ),
            }}
          />
        </div>
      ) : (
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">Task</TableHead>
              <TableHead className="w-1/6">Priority</TableHead>
              <TableHead className="w-1/6">Deadline</TableHead>
              <TableHead className="w-1/6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks
              .sort((a, b) => {
                const priorityOrder = { High: 1, Normal: 2, Low: 3 };

                if (sortCriteria === "deadline") {
                  if (a.deadline && b.deadline) {
                    const deadlineComparison =
                      new Date(a.deadline) - new Date(b.deadline);
                    if (deadlineComparison !== 0) {
                      return deadlineComparison;
                    }
                  } else if (a.deadline) {
                    return -1;
                  } else if (b.deadline) {
                    return 1;
                  }
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                } else if (sortCriteria === "priority") {
                  const priorityComparison =
                    priorityOrder[a.priority] - priorityOrder[b.priority];
                  if (priorityComparison !== 0) {
                    return priorityComparison;
                  }
                  if (a.deadline && b.deadline) {
                    return new Date(a.deadline) - new Date(b.deadline);
                  } else if (a.deadline) {
                    return -1;
                  } else if (b.deadline) {
                    return 1;
                  }
                  return 0;
                }
                return 0;
              })
              .map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="w-1/2 break-words whitespace-normal">
                    {task.text}
                  </TableCell>
                  <TableCell className="w-1/6">{task.priority}</TableCell>
                  <TableCell className="w-1/6">
                    {task.deadline
                      ? new Date(task.deadline).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="w-1/6">
                    <Button
                      onClick={() => deleteTask(task.id)}
                      variant="destructive"
                      className="px-2 py-1 bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableCaption>Your Tasks</TableCaption>
        </Table>
      )}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <ul>
            {selectedDateTasks.map((task) => (
              <li key={task.id}>
                {task.text} - {task.priority}
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </div>
  );
};
export default Todo;
