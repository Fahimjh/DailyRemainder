import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/apiInstance";

const Bookmarks: React.FC = () => {
  const { user, setUser } = useContext(AuthContext);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (user?.bookmarks) setItems(user.bookmarks);
  }, [user]);

  const remove = async (index: number) => {
    const newBookmarks = items.filter((_, i) => i !== index);
    setItems(newBookmarks);
    // save to backend: simple approach - update user document bookmarks (requires backend route)
    try {
      await API.post("/auth/updateBookmarks", { userId: user?._id, bookmarks: newBookmarks });
      setUser && setUser({ ...(user as any), bookmarks: newBookmarks });
    } catch {
      alert("Failed to update bookmarks on server");
    }
  };

  return (
    <div className="container">
      <h2>Bookmarks</h2>
      <div className="grid">
        {items.length === 0 && <div className="card">No bookmarks yet</div>}
        {items.map((it, i) => (
          <div className="card" key={i}>
            <div>{it.title || JSON.stringify(it)}</div>
            <button onClick={() => remove(i)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
