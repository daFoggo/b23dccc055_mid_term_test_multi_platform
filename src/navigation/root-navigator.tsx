// Stack navigator: TaskList, TaskForm, TaskDetail.
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TaskDetailScreen} from '../features/tasks/screens/task-detail-screen';
import {TaskFormScreen} from '../features/tasks/screens/task-form-screen';
import {TaskListScreen} from '../features/tasks/screens/task-list-screen';
import {colors} from '../theme/colors';
import type {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.surface},
        headerTintColor: colors.onSurface,
        contentStyle: {backgroundColor: colors.surface},
      }}>
      <Stack.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{title: 'Kế hoạch cá nhân'}}
      />
      <Stack.Screen
        name="TaskForm"
        component={TaskFormScreen}
        options={({route}) => ({
          title: route.params?.taskId ? 'Sửa công việc' : 'Thêm công việc',
        })}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{title: 'Chi tiết công việc'}}
      />
    </Stack.Navigator>
  );
}
