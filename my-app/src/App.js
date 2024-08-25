import React, { useState } from 'react';
import UsernameForm from './components/UsernameForm';
import TodoList from './components/TodoList';
import './App.css';

function App() {
  const [username, setUsername] = useState(null);

  const handleUsernameSubmit = (name) => {
    fetch(`https://playground.4geeks.com/todo/users/${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setUsername(name); 
      })
      .catch(error => {
        console.error('Error al crear el username:', error);
      });
  };

  return (
    <div className="App">
      {!username ? (
        <UsernameForm onSubmit={handleUsernameSubmit} />
      ) : (
        <TodoList username={username} />
      )}
    </div>
  );
}

export default App;
