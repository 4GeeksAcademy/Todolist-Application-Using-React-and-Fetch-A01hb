import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';

function TodoList({ username }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetch(`https://playground.4geeks.com/todo/users/${username}`)
      .then(response => response.json())
      .then(data => {
        console.log('Todos fetched:', data); 
        if (Array.isArray(data.todos)) {
          setTodos(data.todos);
        } else {
          console.error("La respuesta no es un arreglo:", data);
          setTodos([]);
        }
      })
      .catch(error => {
        console.error('Error al obtener los todos:', error);
      });
  }, [username]);

  const addTodo = () => {
    const todoData = {
      label: newTodo,
      is_done: false,
    };

    fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Respuesta al agregar todo:', data);
        if (data && data.id) {
          setTodos([...todos, data]);
        } else {
          console.error("Error al agregar el todo:", data);
        }
        setNewTodo('');
      })
      .catch(error => {
        console.error('Error al agregar el todo:', error);
      });
  };

  const deleteTodo = (id) => {
    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        console.error('Error al eliminar el todo:', error);
      });
  };

  const editTodo = (id, newText) => {
    const updatedTodo = {
      label: newText,
      is_done: false,
    };

    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodo),
    })
      .then(response => response.json())
      .then(() => {
        setTodos(todos.map(todo => (todo.id === id ? { ...todo, label: newText } : todo)));
      })
      .catch(error => {
        console.error('Error al editar el todo:', error);
      });
  };

  return (
    <div>
      <h2>{username}'s Todo List</h2>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {Array.isArray(todos) && todos.length > 0 ? (
          todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onDelete={deleteTodo} onEdit={editTodo} />
          ))
        ) : (
          <li>No todos available</li>
        )}
      </ul>
    </div>
  );
}

export default TodoList;
