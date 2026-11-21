import React from 'react';
import { useSelector } from 'react-redux';
import AuthView from './components/AuthView';
import TodoDashboard from './components/TodoDashboard';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const { role, token } = useSelector((state) => state.auth);

  if (!token) {
    return <AuthView />;
  }

  if (role === 'admin') {
    return <AdminDashboard />;
  }

  return <TodoDashboard />;
}