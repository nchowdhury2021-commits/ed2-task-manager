import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export default function Tasks() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // Read: live-subscribe to this user's tasks, newest first
    // Read: live-subscribe to this user's tasks, newest first
  useEffect(() => {
    const q = query(
      collection(db, "tasks"),
      where("userId", "==", currentUser.uid)
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        data.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
        setTasks(data);
      },
      (error) => {
        console.error("Tasks listener error:", error);
      }
    );
    return unsubscribe;
  }, [currentUser]);

  // Create
  async function handleAddTask(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await addDoc(collection(db, "tasks"), {
      title: title.trim(),
      completed: false,
      userId: currentUser.uid,
      createdAt: serverTimestamp(),
    });
    setTitle("");
  }

  // Update: toggle complete
  async function toggleComplete(task) {
    await updateDoc(doc(db, "tasks", task.id), {
      completed: !task.completed,
    });
  }

  // Delete
  async function handleDelete(taskId) {
    await deleteDoc(doc(db, "tasks", taskId));
  }

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>My Tasks</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <p style={{ color: "#666" }}>Logged in as: {currentUser?.email}</p>

      <form onSubmit={handleAddTask} style={{ display: "flex", gap: 8, margin: "20px 0" }}>
        <input
          type="text"
          placeholder="New task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit">Add Task</button>
      </form>

      {tasks.length === 0 && <p><em>No tasks yet — add one above.</em></p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 0",
              borderBottom: "1px solid #ddd",
            }}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task)}
            />
            <span
              style={{
                flex: 1,
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "#999" : "inherit",
              }}
            >
              {task.title}
            </span>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}