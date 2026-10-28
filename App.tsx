/**
 * PlannerApp - Quan ly ke hoach ca nhan
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SnackbarProvider } from './src/components/ui/snackbar';
import { TasksProvider } from './src/features/tasks/tasks-context';
import { RootNavigator } from './src/navigation/root-navigator';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <TasksProvider>
        <SnackbarProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SnackbarProvider>
      </TasksProvider>
    </SafeAreaProvider>
  );
}

export default App;
