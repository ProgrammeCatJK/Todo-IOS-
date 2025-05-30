import { Keyboard, FlatList, StyleSheet, Image, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"
import { Checkbox } from "expo-checkbox"
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { SearchBar } from "react-native-screens";
type ToDoType = {
  id: number,
  title: string,
  isDone: boolean,
}
export default function Index() {
  // start using it, state
  

  // use todos 
  const [todos, setTodos] = useState<ToDoType[]>([]);
  const [todoText, setTodoText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [Oldtodos, setOldTodos] = useState<ToDoType[]>([]);

  // useEffect to check the storage when the app appears
  useEffect(() => {
    const getTodos = async () => {
      try {
        const todos = await AsyncStorage.getItem("my-todo");
        if (todos !== null) {
          setTodos(JSON.parse(todos));
          setOldTodos(JSON.parse(todos));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getTodos();
  }, []);

  const addTodo = async () => {
    try {
      const newTodo = {
        id: Math.random(),
        title: todoText,
        isDone: false,
      };
    
      todos.push(newTodo);
      setTodos(todos);
      setOldTodos(todos);
      await AsyncStorage.setItem('my-todo', JSON.stringify(todos));
      setTodoText('');
      Keyboard.dismiss()
    } catch (error) {
      console.log(error);
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      const newTodos = todos.filter((todo) => todo.id !== id);
      await AsyncStorage.setItem("my-todo", JSON.stringify(newTodos));
      setTodos(newTodos);
      setOldTodos(newTodos);
    } catch(error) {
      console.log(error);
    }
  };

  const handleDone = async (id: number) => {
    try {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          todo.isDone = !todo.isDone;
        }
        return todo;
      });
      await AsyncStorage.setItem("my-todo", JSON.stringify(newTodos))
      setTodos(newTodos);
      setOldTodos(newTodos);
    } catch (error) {
      console.log(error);
    }
  }

  const onSearch = (query: string) => {
    if (query == '') {
      setTodos(Oldtodos);
    } else {
      const filteredTodos = todos.filter((todo) =>
        todo.title.toLowerCase().includes(query.toLowerCase())
      );
      setTodos(filteredTodos);
    }
  }

  useEffect(()=> {
    onSearch(searchQuery);
  }, [searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <View style = {styles.header}>
        <TouchableOpacity onPress={() => {alert("Clicked")}}>
          <Ionicons name="menu" size = {24} color = {"#333"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}}>
          <Image
            source={{uri:'https://dogemuchwow.com/wp-content/uploads/2019/07/ascii-doge-face.png'}}
            style ={{width: 40, height: 40, borderRadius: 20}}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size = {24} color={"#333"}/>
        <TextInput 
          placeholder="Search"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          style={styles.searchInput}
          clearButtonMode="always"
        />
      </View>

      <FlatList
        data={[...todos].reverse()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ToDoItem todo={item} deleteTodo={deleteTodo} handleTodo={handleDone} />
        )}
      />
      <KeyboardAvoidingView
        style= {styles.footer} behavior="padding"
        keyboardVerticalOffset={5}>
        <TextInput
          placeholder="Add New Todo"
          value={todoText}
          onChangeText={(text)=> setTodoText(text)}
          style={styles.newTodoInput}
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.todoAdd} onPress={() => addTodo()}>
          <Ionicons name="add" size={34} color={"#fff"}/>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// creating custom type
const ToDoItem = ({ todo, deleteTodo, handleTodo } : {
  todo: ToDoType,
  deleteTodo: (id : number) => void,
  handleTodo: (id : number) => void,
  }) => (
  <View style={styles.todoContainer}>
    <View style={styles.todoInfoContainer}>
      <Checkbox
        value={todo.isDone}
        onValueChange={() => handleTodo(todo.id)}
        color={todo.isDone ? "#4630EB" : undefined}/>
      <Text
        style={[
          styles.todoText,
          todo.isDone && { textDecorationLine: "line-through"}
        ]}
      >
        {todo.title}</Text>
    </View>
    <TouchableOpacity
      onPress={()=>{
        deleteTodo(todo.id);
        alert("Delete item " + todo.id);
      }}
    >
      <Ionicons name="trash" size={24} color={"red"}/>
    </TouchableOpacity>     
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
    
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    gap: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  todoContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  todoInfoContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center"
  },
  todoText: {
    fontSize: 16,
    color: "#333"
  },
  todoAdd: {
    backgroundColor: "#4630EB",
    padding: 8,
    borderRadius: 10,
    marginLeft: 20,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  newTodoInput: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    color: "#333",
  }
})


