import React from 'react';
import firestore from '@react-native-firebase/firestore';
import { FlatList, View, Text } from 'react-native';
import { Appbar, TextInput, Button } from 'react-native-paper';
import Todo from './Todo';

function App() {
  const [todo, setTodo] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [todos, setTodos] = React.useState([]);

  const ref = firestore().collection('todos');

  async function addTodo() {
    await ref.add({
      title: todo,
      complete: false,
    });
    setTodo('');
  }

  React.useEffect(() => {
    const unsubscribe = ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const { title, complete } = doc.data();
        list.push({
          id: doc.id,
          title,
          complete,
        });
      });
      setTodos(list);
      if (loading) {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [loading, ref]);

  if (loading) {
    return null; // or a spinner
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar>
        <Appbar.Content title={'TODOS List'} />
      </Appbar>
      <FlatList
        style={{ flex: 1 }}
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Todo {...item} />}
      />
      <TextInput label='New Todo' value={todo} onChangeText={(text) => setTodo(text)} />
      <Button onPress={addTodo}>Add TODO</Button>
    </View>
  );
}

export default App;
