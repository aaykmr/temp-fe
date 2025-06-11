import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authService} from '../../services/authService';
import {userService} from '../../services/userService';

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  initialized: false,
};

export const initialize = createAsyncThunk('auth/initialize', async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
});

export const register = createAsyncThunk(
  'auth/register',
  async (data: any, {rejectWithValue}) => {
    try {
      const response = await authService.register(data);
      await AsyncStorage.setItem('token', response?.data?.token);
      return response?.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed',
      );
    }
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async (data: any, {rejectWithValue}) => {
    try {
      const response = await authService.login(data);
      await AsyncStorage.setItem('token', response?.data?.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  },
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (userId: string, {rejectWithValue}) => {
    try {
      const response = await userService.getUserDetails(userId);
      return response?.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get profile',
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({userId, data}: {userId: string; data: any}, {rejectWithValue}) => {
    try {
      const response = await userService.updateProfile(userId, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile',
      );
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.token = null;
      AsyncStorage.removeItem('token');
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Initialize
      .addCase(initialize.fulfilled, (state, action) => {
        state.token = action.payload;
        state.initialized = true;
      })
      // Register
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Profile
      .addCase(getProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {logout, clearError} = authSlice.actions;
export default authSlice.reducer;
