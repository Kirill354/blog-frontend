import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import axios from '../../axios';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

export const AddPost = () => {
   const navigate = useNavigate();
   const { id } = useParams();
   const isAuth = useSelector((state) => Boolean(state.auth.data));
   const inputFileRef = useRef(null);
   const isEditing = Boolean(id);

   const [text, setText] = useState('');
   const [title, setTitle] = useState('');
   const [tags, setTags] = useState('');
   const [imageUrl, setImageUrl] = useState('');

   useEffect(() => {
      if (id) {
         axios
            .get(`/posts/${id}`)
            .then((res) => {
               setTitle(res.data.title);
               setTags(res.data.tags.join(' '));
               setText(res.data.text);
               setImageUrl(res.data.imageUrl);
            })
            .catch((err) => {
               console.warn(err);
               alert('Не удалось редактировать пост');
            });
      }
   }, []);

   const handleChangeFile = async (event) => {
      try {
         const formData = new FormData();
         const file = event.target.files[0];
         formData.append('image', file);

         const { data } = await axios.post('/upload', formData);
         setImageUrl(data.url);
      } catch (error) {
         console.warn(error);
         alert('Ошибка при загрузке файла');
      }
   };

   const onSubmit = async () => {
      try {
         const values = {
            title,
            text,
            tags,
            imageUrl,
         };

         const { data } = isEditing
            ? await axios.patch(`/posts/${id}`, values)
            : await axios.post('/posts', values);

         const _id = isEditing ? id : data._id;
         navigate(`/posts/${_id}`);
      } catch (error) {
         console.warn(error);
         alert('Не удалось опубликовать статью');
      }
   };

   const onChange = useCallback((value) => {
      setText(value);
   }, []);

   const options = useMemo(
      () => ({
         spellChecker: false,
         maxHeight: '400px',
         autofocus: true,
         placeholder: 'Введите текст...',
         status: false,
         autosave: {
            enabled: true,
            delay: 1000,
         },
      }),
      [],
   );

   if (!isAuth) {
      return <Navigate to="/" />;
   }

   return (
      <Paper style={{ padding: 30 }}>
         <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
            Загрузить превью
         </Button>
         <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
         {imageUrl && (
            <>
               <Button variant="contained" color="error" onClick={() => setImageUrl('')}>
                  Удалить
               </Button>
               <img
                  className={styles.image}
                  src={`http://localhost:4444${imageUrl}`}
                  alt="Uploaded"
               />
            </>
         )}

         <br />
         <br />
         <TextField
            classes={{ root: styles.title }}
            variant="standard"
            placeholder="Заголовок статьи..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
         />
         <TextField
            classes={{ root: styles.tags }}
            variant="standard"
            placeholder="Тэги (укажите через пробел)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            fullWidth
         />
         <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
         <div className={styles.buttons}>
            <Button onClick={onSubmit} size="large" variant="contained">
               {isEditing ? 'Сохранить' : 'Опубликовать'}
            </Button>
            <Link to="/">
               <Button size="large">Отмена</Button>
            </Link>
         </div>
      </Paper>
   );
};
