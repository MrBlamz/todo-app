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

  function getPriority() {
    return _priority;
  }

  function getNotes() {
    return _notes;
  }

  return {
    getName,
    getDueDate,
    getPriority,
    getNotes,
  };
};

export default Todo;
