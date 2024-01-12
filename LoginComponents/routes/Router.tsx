import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AppwriteContext} from '../appwrite/AppwriteContext';
import Loading from '../components/Loading';
import {AuthStack} from './AuthStack';
import Application from '../../Application';
import {useSelector, useDispatch} from 'react-redux';
import {setUniqueEmailId} from '../../mainReducers';

export const Router = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {appwrite, isLoggedIn, setIsLoggedIn} = useContext(AppwriteContext);

  useEffect(() => {
    appwrite
      .getCurrentUser()
      .then(response => {
        setIsLoading(false);
        if (response) {
          setIsLoggedIn(true);
          dispatch(setUniqueEmailId(response.email));
        }
      })
      .catch(_ => {
        setIsLoading(false);
        setIsLoggedIn(false);
      });
  }, [appwrite, setIsLoggedIn]);

  return (
    <>
      {isLoading && <Loading />}
      <NavigationContainer>
        {isLoggedIn ? <Application /> : <AuthStack />}
      </NavigationContainer>
    </>
  );
};
