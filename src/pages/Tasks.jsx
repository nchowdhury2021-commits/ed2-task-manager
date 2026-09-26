import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Tasks() {
  const { currentUser } = useAuth();

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>My Tasks</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <p>Logged in as: {currentUser?.email}</p>
      <p><em>Task list coming next...</em></p>
    </div>
  );
}