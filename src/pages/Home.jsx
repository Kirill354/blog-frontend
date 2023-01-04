import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts';

export const Home = () => {
   const dispatch = useDispatch();
   const userData = useSelector((state) => state.auth.data);
   const { posts, tags } = useSelector((state) => state.posts);

   const isPostLoading = posts.status === 'loading';
   const isTagsLoading = tags.status === 'loading';

   useEffect(() => {
      dispatch(fetchPosts());
      dispatch(fetchTags());
   }, []);

   return (
      <>
         <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
            <Tab label="Новые" />
            <Tab label="Популярные" />
         </Tabs>
         <Grid container spacing={4}>
            <Grid xs={8} item>
               {(isPostLoading ? [...Array(5)] : posts.items).map((post, index) =>
                  isPostLoading ? (
                     <Post key={index} isLoading={true} />
                  ) : (
                     <Post
                        key={index}
                        id={post._id}
                        title={post.title}
                        imageUrl={post.imageUrl ? `http://localhost:4444${post.imageUrl}` : ''}
                        user={post.user}
                        createdAt={post.createdAt}
                        viewsCount={post.viewsCount}
                        commentsCount={3}
                        tags={post.tags}
                        isEditable={post.user._id === userData?._id}
                     />
                  ),
               )}
            </Grid>
            <Grid xs={4} item>
               <TagsBlock items={tags.items} isLoading={isTagsLoading} />
               <CommentsBlock
                  items={[
                     {
                        user: {
                           fullName: 'Вася Пупкин',
                           avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                        },
                        text: 'Это тестовый комментарий',
                     },
                     {
                        user: {
                           fullName: 'Иван Иванов',
                           avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                        },
                        text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
                     },
                  ]}
                  isLoading={false}
               />
            </Grid>
         </Grid>
      </>
   );
};
