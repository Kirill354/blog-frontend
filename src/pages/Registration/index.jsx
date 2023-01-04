import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import { fetchRegister } from '../../redux/slices/auth';

import styles from './Login.module.scss';

export const Registration = () => {
   const dispatch = useDispatch();
   const isAuth = useSelector((state) => Boolean(state.auth.data));

   const {
      register,
      handleSubmit,
      formState: { errors, isValid },
   } = useForm({
      mode: 'onChange',
   });

   const onSubmit = async (values) => {
      try {
         const data = await dispatch(fetchRegister(values));
         if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token);
         }
      } catch (error) {
         return alert('Не удалось зарегистрироваться');
      }
   };

   if (isAuth) {
      return <Navigate to="/" />;
   }

   return (
      <Paper classes={{ root: styles.root }}>
         <Typography classes={{ root: styles.title }} variant="h5">
            Создание аккаунта
         </Typography>
         <div className={styles.avatar}>
            <Avatar sx={{ width: 100, height: 100 }} className={styles.avatarImage} />
         </div>
         <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
               className={styles.field}
               label="Полное имя"
               {...register('fullName', { required: 'Укажите имя и фамилие' })}
               error={Boolean(errors.fullName?.message)}
               helperText={errors.fullName?.message}
               fullWidth
            />
            <TextField
               className={styles.field}
               label="E-Mail"
               {...register('email', { required: 'Укажите почту' })}
               error={Boolean(errors.email?.message)}
               helperText={errors.email?.message}
               fullWidth
            />
            <TextField
               className={styles.field}
               label="Пароль"
               {...register('password', { required: 'Укажите пароль' })}
               error={Boolean(errors.password?.message)}
               helperText={errors.password?.message}
               type="password"
               fullWidth
            />
            <TextField
               className={styles.field}
               label="Укажите ссылку на аватар"
               {...register('avatarUrl')}
               fullWidth
            />
            <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
               Зарегистрироваться
            </Button>
         </form>
      </Paper>
   );
};
