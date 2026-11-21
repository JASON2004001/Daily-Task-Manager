import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import {
  fetchTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
  clearAllTodos,
  resetTodoState,
} from '../store/todoSlice';

export default function TodoDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: todos, loading } = useSelector((state) => state.todos);

  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    dispatch(addTodo(newTask));
    setNewTask('');
  };

  const handleClearAll = () => {
    if (todos.length === 0) return;
    if (window.confirm('Are you sure you want to delete ALL your tasks?')) {
      dispatch(clearAllTodos());
    }
  };

  const handleLogout = () => {
    dispatch(resetTodoState());
    dispatch(logout());
  };

  const completedCount = todos.filter((t) => t.isCompleted).length;

  return (
    <div className="min-h-screen bg-[#090d16] text-[#f1f5f9] p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Top Greeting Header: "Hi <User Name>," */}
        <header className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#10b981]">
              Hi {user?.name},
            </h1>
            <p className="text-xs text-[#94a3b8] mt-1">
              You have {todos.length} {todos.length === 1 ? 'task' : 'tasks'} ({completedCount} completed)
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#1f2937] hover:bg-red-500/20 hover:text-red-400 text-xs font-semibold transition cursor-pointer"
          >
            Log Out
          </button>
        </header>

        {/* Add New Task Form */}
        <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Write a new daily task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 px-4 py-3.5 rounded-xl bg-[#111827] border border-[#1f2937] text-sm text-white focus:outline-none focus:border-[#10b981]"
          />
          <button
            type="submit"
            className="px-6 py-3.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-black font-bold text-sm transition cursor-pointer"
          >
            + Add Task
          </button>
        </form>

        {/* Task List Container */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1f2937]">
            <h2 className="text-sm font-semibold text-[#cbd5e1] uppercase tracking-wider">
              Your Daily Tasks
            </h2>

            {todos.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-red-400 hover:text-red-300 font-semibold hover:underline cursor-pointer"
              >
                Delete Everything
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-center text-xs text-[#94a3b8] py-8">Loading tasks...</p>
          ) : todos.length === 0 ? (
            <div className="text-center py-10 space-y-1">
              <p className="text-sm text-[#94a3b8]">No tasks added yet.</p>
              <p className="text-xs text-[#64748b]">Type a task above to get started!</p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {todos.map((todo) => (
                <li
                  key={todo._id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                    todo.isCompleted
                      ? 'bg-[#0b111e] border-[#10b981]/30'
                      : 'bg-[#090d16] border-[#1f2937]'
                  }`}
                >
                  {/* Tick Mark + Task Text */}
                  <div
                    onClick={() => dispatch(toggleTodo(todo._id))}
                    className="flex items-center gap-3 flex-1 cursor-pointer select-none"
                  >
                    <button
                      type="button"
                      aria-label="Toggle Complete"
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border text-xs font-bold transition ${
                        todo.isCompleted
                          ? 'bg-[#10b981] border-[#10b981] text-black'
                          : 'border-[#475569] text-transparent hover:border-[#10b981]'
                      }`}
                    >
                      ✓
                    </button>
                    <span
                      className={`text-sm ${
                        todo.isCompleted ? 'line-through text-[#64748b]' : 'text-[#f1f5f9]'
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>

                  {/* Delete Single Task */}
                  <button
                    onClick={() => dispatch(deleteTodo(todo._id))}
                    className="px-2.5 py-1 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}