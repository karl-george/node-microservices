import { useState } from 'react';
import { createTask } from '../api/tasks';

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const task = await createTask({
        title,
        description,
        userId,
      });

      onTaskCreated(task);

      setTitle('');
      setDescription('');
      setUserId('');
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(event) => setUserId(event.target.value)}
      />

      <button type="submit">Create Task</button>
    </form>
  );
}

export default TaskForm;
