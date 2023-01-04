import React from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import styles from './Login.module.scss';
import { fetchAuth } from '../../redux/slices/auth';

export const Login = () => {
   const dispatch = useDispatch();
   const isAuth = useSelector((state) => Boolean(state.auth.data));

   const {
      register,
      handleSubmit,
      formState: { errors, isValid },
   } = useForm({
      defaultValues: {
         email: 'test3@test.ru',
         password: '12345',
      },
      mode: 'onChange',
   });

   const onSubmit = async (values) => {
      try {
         const data = await dispatch(fetchAuth(values));
         if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token);
         }
      } catch (error) {
         return alert('Не удалось авторизоваться');
      }
   };

   if (isAuth) {
      return <Navigate to="/" />;
   }

   return (
      <Paper classes={{ root: styles.root }}>
         <Typography classes={{ root: styles.title }} variant="h5">
            Вход в аккаунт
         </Typography>
         <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
               className={styles.field}
               label="E-Mail"
               error={Boolean(errors.email?.message)}
               helperText={errors.email?.message}
               {...register('email', { required: 'Укажите почту' })}
               type="email"
               fullWidth
            />
            <TextField
               className={styles.field}
               {...register('password', { required: 'Укажите пароль' })}
               error={Boolean(errors.password?.message)}
               helperText={errors.password?.message}
               label="Пароль"
               fullWidth
            />
            <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
               Войти
            </Button>
         </form>
      </Paper>
   );
};
