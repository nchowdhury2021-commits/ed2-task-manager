import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  collection, addDoc, query, where, onSnapshot,
  deleteDoc, doc, updateDoc, serverTimestamp,
} from "firebase/firestore";
import Logo from "../components/Logo";

const PRIORITIES = ["low", "medium", "high"];

export default function Tasks() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");

  useEffect(() => {
    const q = query(collection(db, "tasks"), where("userId", "==", currentUser.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        data.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
        setTasks(data);
        setLoading(false);
      },
      (error) => {
        console.error("Tasks listener error:", error);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [currentUser]);

  async function handleAddTask(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await addDoc(collection(db, "tasks"), {
      title: title.trim(),
      completed: false,
      priority,
      dueDate: dueDate || null,
      userId: currentUser.uid,
      createdAt: serverTimestamp(),
    });
    setTitle("");
    setDueDate("");
    setPriority("medium");
  }

  async function toggleComplete(task) {
    await updateDoc(doc(db, "tasks", task.id), { completed: !task.completed });
  }

  async function handleDelete(taskId) {
    if (!window.confirm("Delete this task? This can't be undone.")) return;
    await deleteDoc(doc(db, "tasks", taskId));
  }

  async function handleLogout() {
    await signOut(auth);
  }

  const openCount = tasks.filter((t) => !t.completed).length;
  const doneCount = tasks.length - openCount;

  function formatDue(dueDateStr) {
    if (!dueDateStr) return null;
    const date = new Date(dueDateStr + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return {
      label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      overdue: date < today,
    };
  }

  return (
    <div className="ledger-shell">
      <div className="ledger-header">
        <div className="brand">
          <Logo size={28} />
          <div>
            <h1>Task Ledger</h1>
            <div className="ledger-meta">{currentUser?.email}</div>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
      </div>

      {!loading && tasks.length > 0 && (
        <div className="ledger-stats">
          <span><strong>{openCount}</strong> open</span>
          <span><strong>{doneCount}</strong> done</span>
        </div>
      )}

      <form onSubmit={handleAddTask} className="task-form">
        <input type="text" className="input title-input" placeholder="Add a task..."
          value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="date" className="input date-input"
          value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <select className="input" value={priority} onChange={(e) => setPriority(e.target.value)}>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p[0].toUpperCase() + p.slice(1)}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">Add</button>
      </form>

      {loading ? (
        <p style={{ color: "var(--ink-soft)", marginTop: 24 }}>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <h3>Nothing on the ledger yet</h3>
          <p>Add your first task above to get started.</p>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => {
            const due = formatDue(task.dueDate);
            return (
              <li key={task.id} className={`task-row${task.completed ? " completed" : ""}`}>
                <input type="checkbox" className="task-checkbox" checked={task.completed}
                  onChange={() => toggleComplete(task)} />
                <span className={`priority-dot ${task.priority || "medium"}`}
                  title={`${task.priority || "medium"} priority`} />
                <span className="task-title">{task.title}</span>
                {due && (
                  <span className={`due-chip${due.overdue && !task.completed ? " overdue" : ""}`}>
                    {due.label}
                  </span>
                )}
                <button className="btn-danger-text" onClick={() => handleDelete(task.id)}>
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}