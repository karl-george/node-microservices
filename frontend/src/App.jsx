import { useEffect, useState } from 'react';
import { getTasks } from './api/tasks';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        setError(error.message);
      }
    }

    loadTasks();
  }, []);

  function handleTaskCreated(task) {
    setTasks((currentTasks) => [...currentTasks, task]);
  }

  return (
    <main>
      <h1>Task Service</h1>

      <TaskForm onTaskCreated={handleTaskCreated} />

      {error && <p>{error}</p>}

      <TaskList tasks={tasks} />
    </main>
  );
}

export default App;
