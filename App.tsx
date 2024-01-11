import React from 'react';
import {AppwriteProvider} from './LoginComponents/appwrite/AppwriteContext';
import {Router} from './LoginComponents/routes/Router';
import {Provider} from 'react-redux';
import store from './store';

const App = () => {
  return (
    <Provider store={store}>
      <AppwriteProvider>
        <Router />
      </AppwriteProvider>
    </Provider>
  );
};

export default App;
