import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import matchService from '../../services/matchService';

interface MatchState {
  currentMatch: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: MatchState = {
  currentMatch: null,
  loading: false,
  error: null,
};

export const findMatch = createAsyncThunk(
  'match/find',
  async (_, {rejectWithValue}) => {
    try {
      const response = await matchService.findMatch();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to find match',
      );
    }
  },
);

export const getCurrentMatch = createAsyncThunk(
  'match/getCurrent',
  async (_, {rejectWithValue}) => {
    try {
      const response = await matchService.getCurrentMatch();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get current match',
      );
    }
  },
);

export const extendMatch = createAsyncThunk(
  'match/extend',
  async (matchId: string, {rejectWithValue}) => {
    try {
      const response = await matchService.extendMatch(matchId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to extend match',
      );
    }
  },
);

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    clearMatch: state => {
      state.currentMatch = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Find Match
      .addCase(findMatch.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findMatch.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMatch = action.payload.match;
      })
      .addCase(findMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Current Match
      .addCase(getCurrentMatch.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentMatch.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMatch = action.payload.match;
      })
      .addCase(getCurrentMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Extend Match
      .addCase(extendMatch.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(extendMatch.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMatch = {
          ...state.currentMatch,
          ...action.payload.match,
        };
      })
      .addCase(extendMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {clearMatch, clearError} = matchSlice.actions;
export default matchSlice.reducer;
