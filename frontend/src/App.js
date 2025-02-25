// App.js
import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(Array.isArray(data) ? data : []);
      } else {
        console.error('Error response:', response.status);
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      
      if (response.ok) {
        setTitle('');
        setDescription('');
        fetchTasks();
      } else {
        console.error('Error creating task:', response.status);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const completeTask = async (id) => {
    try {
      const response = await fetch(`/api/tasks/${id}/complete`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        fetchTasks();
      } else {
        console.error('Error completing task:', response.status);
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="app-card">
        <div className="form-column">
          <h2 className="form-title">Add a Task</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea"
              />
            </div>
            <button type="submit" className="add-button">Add</button>
          </form>
        </div>
        
        <div className="task-column">
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            (tasks || []).map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-content">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                </div>
                <button 
                  className="done-button" 
                  onClick={() => completeTask(task.id)}
                >
                  Done
                </button>
              </div>
            ))
          )}
          {!isLoading && tasks.length === 0 && (
            <div className="empty-state">
              <p>No tasks yet. Add your first task!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;