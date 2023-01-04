import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { logout } from '../../redux/slices/auth';

export const Header = () => {
   const dispatch = useDispatch();
   const isAuth = useSelector((state) => Boolean(state.auth.data));

   const onClickLogout = () => {
      if (window.confirm('Вы действительно хотите выйти?')) {
         dispatch(logout());
         window.localStorage.removeItem('token');
      }
   };

   return (
      <div className={styles.root}>
         <Container maxWidth="lg">
            <div className={styles.inner}>
               <Link to="/" className={styles.logo}>
                  <div>REACT BLOG</div>
               </Link>
               <div className={styles.buttons}>
                  {isAuth ? (
                     <>
                        <Link to="/posts/create">
                           <Button variant="contained">Написать статью</Button>
                        </Link>
                        <Button onClick={onClickLogout} variant="contained" color="error">
                           Выйти
                        </Button>
                     </>
                  ) : (
                     <>
                        <Link to="/login">
                           <Button variant="outlined">Войти</Button>
                        </Link>
                        <Link to="/register">
                           <Button variant="contained">Создать аккаунт</Button>
                        </Link>
                     </>
                  )}
               </div>
            </div>
         </Container>
      </div>
   );
};
