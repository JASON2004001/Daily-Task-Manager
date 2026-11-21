import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = 'http://localhost:5000/api';

const savedSession = JSON.parse(localStorage.getItem('todo_redux_session')) || {
  role: null,
  token: null,
  user: null,
  admin: null,
};

// Async Thunk: User Login / Signup
export const authenticateUser = createAsyncThunk(
  'auth/authenticateUser',
  async ({ mode, payload }, { rejectWithValue }) => {
    try {
      const endpoint = mode === 'signup' ? '/auth/signup' : '/auth/login';
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Authentication failed');
      return { role: 'user', token: data.token, user: data.user };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async Thunk: Admin Login (Prosenjit / 12345)
export const authenticateAdmin = createAsyncThunk(
  'auth/authenticateAdmin',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Invalid Admin credentials');
      return { role: 'admin', token: data.token, admin: data.admin };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    ...savedSession,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('todo_redux_session');
      state.role = null;
      state.token = null;
      state.user = null;
      state.admin = null;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // User Auth
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload.role;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.admin = null;
        localStorage.setItem('todo_redux_session', JSON.stringify(action.payload));
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Admin Auth
      .addCase(authenticateAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload.role;
        state.token = action.payload.token;
        state.admin = action.payload.admin;
        state.user = null;
        localStorage.setItem('todo_redux_session', JSON.stringify(action.payload));
      })
      .addCase(authenticateAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;