import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
   const { data } = await axios.get('/posts');
   return data;
});

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
   const { data } = await axios.get('/posts/tags');
   return data;
});

export const removePost = createAsyncThunk('posts/removePost', async (id) => {
   await axios.delete(`/posts/${id}`);
});

const initialState = {
   posts: {
      items: [],
      status: 'loading',
   },
   tags: {
      items: [],
      status: 'loading',
   },
};

const postsSlice = createSlice({
   name: 'posts',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      // fetchPosts
      builder.addCase(fetchPosts.pending, (state) => {
         state.posts.status = 'loading';
         state.posts.items = [];
      });
      builder.addCase(fetchPosts.fulfilled, (state, action) => {
         state.posts.status = 'success';
         state.posts.items = action.payload;
      });
      builder.addCase(fetchPosts.rejected, (state) => {
         state.posts.status = 'error';
         state.posts.items = [];
      });
      // fetchTags
      builder.addCase(fetchTags.pending, (state) => {
         state.tags.status = 'loading';
         state.tags.items = [];
      });
      builder.addCase(fetchTags.fulfilled, (state, action) => {
         state.tags.status = 'success';
         state.tags.items = action.payload;
      });
      builder.addCase(fetchTags.rejected, (state) => {
         state.tags.status = 'error';
         state.tags.items = [];
      });
      // removePost
      builder.addCase(removePost.pending, (state, action) => {
         state.posts.items = state.posts.items.filter((item) => item._id !== action.meta.arg);
      });
   },
});

export const postsReducer = postsSlice.reducer;
