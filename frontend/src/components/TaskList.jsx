function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return <p>No tasks found.</p>;
  }

  return (
    <div>
      {tasks.map((task) => (
        <div key={task._id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <small>User: {task.userId}</small>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
