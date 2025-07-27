import { useState, useEffect } from "react";

const MAX_ITEMS = 3;

interface NotTodoItem {
  id: number;
  text: string;
  createdAt: string;
}

export default function NotTodoList() {
  const [items, setItems] = useState<NotTodoItem[]>([]);
  const [newItemText, setNewItemText] = useState("");

  useEffect(() => {
    const savedItems = localStorage.getItem("notTodoItems");
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch (e) {
        console.error("Error loading items:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notTodoItems", JSON.stringify(items));
  }, [items]);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim() || items.length >= MAX_ITEMS) return;

    const newItem: NotTodoItem = {
      id: Date.now(),
      text: newItemText.trim(),
      createdAt: new Date().toISOString(),
    };

    setItems([...items, newItem]);
    setNewItemText("");
  };

  const deleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          NOT To Do List
        </h1>
        
        <form onSubmit={addItem} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="What NOT to do today?"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={100}
            />
            <button
              type="submit"
              disabled={!newItemText.trim() || items.length >= MAX_ITEMS}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Add
            </button>
          </div>
          {items.length >= MAX_ITEMS && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              Maximum {MAX_ITEMS} items reached. Delete an item to add more.
            </p>
          )}
        </form>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <span className="text-gray-800 flex-1 mr-3">{item.text}</span>
              <button
                onClick={() => deleteItem(item.id)}
                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                title="Delete item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No items yet!</p>
            <p className="text-sm mt-2">Add something you want to avoid doing today.</p>
          </div>
        )}

        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Focus on what matters by avoiding what doesn't.</p>
        </div>
      </div>
    </div>
  );
}
