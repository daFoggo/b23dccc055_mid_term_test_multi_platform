/**
 * PlannerApp - Quan ly ke hoach ca nhan
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TasksProvider } from './src/features/tasks/tasks-context';
import { RootNavigator } from './src/navigation/root-navigator';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <TasksProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </TasksProvider>
    </SafeAreaProvider>
  );
}

export default App;
