import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { fetchAdminStats, resetTodoState } from '../store/todoSlice';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.auth);
  const { adminStats: stats, loading } = useSelector((state) => state.todos);

  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(resetTodoState());
    dispatch(logout());
  };

  const toggleUserRow = (userId) => {
    setSelectedUserId((prev) => (prev === userId ? null : userId));
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-[#f1f5f9] p-3 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Responsive Admin Header */}
        <header className="bg-[#111827] border border-[#f59e0b]/40 rounded-2xl p-4 sm:p-6 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#f59e0b]">
              Admin Control Panel
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
              Welcome, {admin?.name}
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#1f2937] hover:bg-red-500/20 hover:text-red-400 text-xs font-semibold transition cursor-pointer"
          >
            Exit Admin
          </button>
        </header>

        {loading || !stats ? (
          <p className="text-center text-sm text-[#94a3b8] py-12">Loading platform analytics...</p>
        ) : (
          <>
            {/* Key Metric Cards (Stacks on mobile, 3 columns on tablet/desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
              <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4 sm:p-5 flex sm:block items-center justify-between">
                <span className="text-xs text-[#94a3b8]">Total People Using App</span>
                <div className="text-2xl sm:text-3xl font-bold text-[#10b981] sm:mt-1">
                  {stats.totalRegisteredUsers}
                </div>
              </div>

              <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4 sm:p-5 flex sm:block items-center justify-between">
                <span className="text-xs text-[#94a3b8]">People Who Stored Tasks</span>
                <div className="text-2xl sm:text-3xl font-bold text-[#f59e0b] sm:mt-1">
                  {stats.usersWhoStoredTasks}
                </div>
              </div>

              <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4 sm:p-5 flex sm:block items-center justify-between">
                <span className="text-xs text-[#94a3b8]">Total Tasks Stored</span>
                <div className="text-2xl sm:text-3xl font-bold text-white sm:mt-1">
                  {stats.totalTasksAcrossPlatform}
                </div>
              </div>
            </div>

            {/* User Storage Breakdown */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 pb-3 border-b border-[#1f2937]">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#cbd5e1]">
                  User Storage Breakdown
                </h2>
                <span className="text-[11px] text-[#94a3b8]">
                  Tap any user to inspect stored tasks
                </span>
              </div>

              {stats.users.length === 0 ? (
                <p className="text-xs text-[#94a3b8] py-4 text-center">No registered users yet.</p>
              ) : (
                <>
                  {/* MOBILE VIEW: Stacked Cards (Visible below 768px) */}
                  <div className="space-y-3 md:hidden">
                    {stats.users.map((u) => {
                      const isExpanded = selectedUserId === u.id;
                      return (
                        <div
                          key={u.id}
                          className="bg-[#090d16] border border-[#1f2937] rounded-xl overflow-hidden"
                        >
                          {/* User Summary Card Header */}
                          <div
                            onClick={() => toggleUserRow(u.id)}
                            className="p-4 cursor-pointer active:bg-[#111827] transition"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-bold text-white truncate">{u.name}</h3>
                                <p className="text-xs text-[#94a3b8] truncate mt-0.5">{u.email}</p>
                              </div>
                              <span className="shrink-0 px-2.5 py-1 rounded-lg bg-[#1f2937] text-[#f59e0b] text-[11px] font-semibold">
                                {isExpanded ? 'Hide ▲' : 'Tasks ▼'}
                              </span>
                            </div>

                            {/* Task Counts Badges */}
                            <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-[#1f2937]/70 text-xs">
                              <span className="text-[#94a3b8]">
                                Stored: <strong className="text-[#f59e0b]">{u.totalTasksStored}</strong>
                              </span>
                              <span className="text-[#94a3b8]">
                                Completed: <strong className="text-[#10b981]">{u.completedTasks}</strong>
                              </span>
                            </div>
                          </div>

                          {/* Expanded Task List on Mobile */}
                          {isExpanded && (
                            <div className="p-3.5 bg-[#0d1320] border-t border-[#1f2937]">
                              <h4 className="text-[11px] font-bold text-[#10b981] uppercase tracking-wider mb-2.5">
                                Tasks by {u.name} ({u.tasks?.length || 0})
                              </h4>

                              {!u.tasks || u.tasks.length === 0 ? (
                                <p className="text-xs text-[#64748b]">No tasks stored yet.</p>
                              ) : (
                                <ul className="space-y-2">
                                  {u.tasks.map((task) => (
                                    <li
                                      key={task.id}
                                      className="p-2.5 rounded-lg bg-[#111827] border border-[#1f2937] flex items-start justify-between gap-2 text-xs"
                                    >
                                      <div className="flex items-start gap-2 min-w-0 flex-1">
                                        <span
                                          className={`mt-0.5 shrink-0 w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                                            task.isCompleted
                                              ? 'bg-[#10b981] text-black'
                                              : 'border border-[#475569] text-transparent'
                                          }`}
                                        >
                                          ✓
                                        </span>
                                        <span
                                          className={`break-words ${
                                            task.isCompleted
                                              ? 'line-through text-[#64748b]'
                                              : 'text-[#f1f5f9]'
                                          }`}
                                        >
                                          {task.text}
                                        </span>
                                      </div>
                                      <span
                                        className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded ${
                                          task.isCompleted
                                            ? 'bg-[#10b981]/15 text-[#10b981]'
                                            : 'bg-[#f59e0b]/15 text-[#f59e0b]'
                                        }`}
                                      >
                                        {task.isCompleted ? 'Done' : 'Pending'}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* DESKTOP VIEW: Structured Table (Visible at 768px and above) */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#1f2937] text-[#94a3b8]">
                          <th className="py-3 px-2">User Name</th>
                          <th className="py-3 px-2">Email</th>
                          <th className="py-3 px-2">Tasks Stored</th>
                          <th className="py-3 px-2">Completed</th>
                          <th className="py-3 px-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.users.map((u) => {
                          const isExpanded = selectedUserId === u.id;
                          return (
                            <React.Fragment key={u.id}>
                              <tr
                                onClick={() => toggleUserRow(u.id)}
                                className={`border-b border-[#1f2937]/50 cursor-pointer transition ${
                                  isExpanded ? 'bg-[#090d16]' : 'hover:bg-[#090d16]/70'
                                }`}
                              >
                                <td className="py-3.5 px-2 font-semibold text-white">{u.name}</td>
                                <td className="py-3.5 px-2 text-[#94a3b8]">{u.email}</td>
                                <td className="py-3.5 px-2 font-bold text-[#f59e0b]">
                                  {u.totalTasksStored}
                                </td>
                                <td className="py-3.5 px-2 text-[#10b981]">{u.completedTasks}</td>
                                <td className="py-3.5 px-2 text-right">
                                  <span className="px-2.5 py-1 rounded-lg bg-[#1f2937] text-[#f59e0b] font-semibold">
                                    {isExpanded ? 'Hide Tasks ▲' : 'View Tasks ▼'}
                                  </span>
                                </td>
                              </tr>

                              {isExpanded && (
                                <tr className="bg-[#090d16] border-b border-[#1f2937]">
                                  <td colSpan="5" className="p-4">
                                    <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4">
                                      <h3 className="text-xs font-bold text-[#10b981] uppercase tracking-wider mb-3">
                                        Stored Tasks by {u.name} ({u.tasks?.length || 0})
                                      </h3>

                                      {!u.tasks || u.tasks.length === 0 ? (
                                        <p className="text-xs text-[#64748b]">
                                          This user has not stored any tasks yet.
                                        </p>
                                      ) : (
                                        <ul className="space-y-2">
                                          {u.tasks.map((task) => (
                                            <li
                                              key={task.id}
                                              className="flex items-center justify-between p-2.5 rounded-lg bg-[#090d16] border border-[#1f2937]"
                                            >
                                              <div className="flex items-center gap-2.5">
                                                <span
                                                  className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                                                    task.isCompleted
                                                      ? 'bg-[#10b981] text-black'
                                                      : 'border border-[#475569] text-transparent'
                                                  }`}
                                                >
                                                  ✓
                                                </span>
                                                <span
                                                  className={
                                                    task.isCompleted
                                                      ? 'line-through text-[#64748b]'
                                                      : 'text-[#f1f5f9]'
                                                  }
                                                >
                                                  {task.text}
                                                </span>
                                              </div>

                                              <span
                                                className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                                  task.isCompleted
                                                    ? 'bg-[#10b981]/15 text-[#10b981]'
                                                    : 'bg-[#f59e0b]/15 text-[#f59e0b]'
                                                }`}
                                              >
                                                {task.isCompleted ? 'Completed' : 'Pending'}
                                              </span>
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
