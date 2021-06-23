const Todo = function (name, dueDate, priority, notes) {
  const _name = name;
  const _dueDate = dueDate;
  const _priority = priority;
  const _notes = notes;

  function getName() {
    return _name;
  }

  function getDueDate() {
    return _dueDate;
  }

  return {
    getName,
    getDueDate,
  };
};

export default Todo;
