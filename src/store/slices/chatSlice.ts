import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import matchService from '../../services/matchService';

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
};

export const getMessages = createAsyncThunk(
  'chat/getMessages',
  async (matchId: string, {rejectWithValue}) => {
    try {
      const response = await matchService.getMessages(matchId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get messages',
      );
    }
  },
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (
    {matchId, content}: {matchId: string; content: string},
    {rejectWithValue},
  ) => {
    try {
      const response = await matchService.sendMessage(matchId, content);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send message',
      );
    }
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: state => {
      state.messages = [];
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Get Messages
      .addCase(getMessages.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Send Message
      .addCase(sendMessage.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload.message);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {addMessage, clearMessages, clearError} = chatSlice.actions;
export default chatSlice.reducer;
