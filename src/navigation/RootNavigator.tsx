import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootStackParamList} from './types';
import {RootState} from '../store';
import {AuthStack} from './AuthStack';
import {MainTab} from './MainTab';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const {token} = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {token ? (
          <Stack.Screen name="Main" component={MainTab} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
