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
    <div className="min-h-screen bg-[#090d16] text-[#f1f5f9] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Admin Header */}
        <header className="bg-[#111827] border border-[#f59e0b]/40 rounded-2xl p-6 mb-6 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#f59e0b]">
              Admin Control Panel
            </span>
            <h1 className="text-2xl font-bold text-white mt-0.5">
              Welcome, {admin?.name}
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-[#1f2937] hover:bg-red-500/20 hover:text-red-400 text-xs font-semibold transition cursor-pointer"
          >
            Exit Admin
          </button>
        </header>

        {loading || !stats ? (
          <p className="text-center text-sm text-[#94a3b8] py-12">Loading platform analytics...</p>
        ) : (
          <>
            {/* Key Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
                <span className="text-xs text-[#94a3b8]">Total People Using App</span>
                <div className="text-3xl font-bold text-[#10b981] mt-1">
                  {stats.totalRegisteredUsers}
                </div>
              </div>

              <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
                <span className="text-xs text-[#94a3b8]">People Who Stored Tasks</span>
                <div className="text-3xl font-bold text-[#f59e0b] mt-1">
                  {stats.usersWhoStoredTasks}
                </div>
              </div>

              <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
                <span className="text-xs text-[#94a3b8]">Total Tasks Stored</span>
                <div className="text-3xl font-bold text-white mt-1">
                  {stats.totalTasksAcrossPlatform}
                </div>
              </div>
            </div>

            {/* Registered Users Breakdown Table (Click any user to view their tasks) */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 shadow-xl overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#cbd5e1]">
                  User Storage Breakdown
                </h2>
                <span className="text-[11px] text-[#94a3b8]">
                  Click any user row to view their stored tasks
                </span>
              </div>

              {stats.users.length === 0 ? (
                <p className="text-xs text-[#94a3b8]">No registered users yet.</p>
              ) : (
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

                          {/* Expanded Drawer Row showing this User's Tasks */}
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
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}