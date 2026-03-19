import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getMemberMembership } from "@/services/adminService";
import type { MemberDashboardInfo } from "@/types";

interface MembershipState {
  data: MemberDashboardInfo | null;
  loading: boolean;
  error: string | null;
}

const initialState: MembershipState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchMembership = createAsyncThunk<
  MemberDashboardInfo,
  void,
  { rejectValue: string }
>("membership/fetch", async (_, { rejectWithValue }) => {
  try {
    return await getMemberMembership();
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to load membership."
    );
  }
});

const membershipSlice = createSlice({
  name: "membership",
  initialState,
  reducers: {
    clearMembership(state) {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
    setMembership(state, action: PayloadAction<MemberDashboardInfo>) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembership.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembership.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMembership.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { clearMembership, setMembership } = membershipSlice.actions;
export default membershipSlice.reducer;
