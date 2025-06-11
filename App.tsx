/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {Provider, useDispatch} from 'react-redux';
import {store, AppDispatch} from './src/store';
import {RootNavigator} from './src/navigation/RootNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'expo-status-bar';
import {initialize} from './src/store/slices/authSlice';

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(initialize());
  }, [dispatch]);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
