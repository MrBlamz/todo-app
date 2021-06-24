const Todo = function (name, dueDate, priority, notes) {
  let _name = name;
  let _dueDate = dueDate;
  let _priority = priority;
  let _notes = notes;

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

  function setName(name) {
    _name = name;
  }

  function setDueDate(dueDate) {
    _dueDate = dueDate;
  }

  function setPriority(priority) {
    _priority = priority;
  }

  function setNotes(notes) {
    _notes = notes;
  }

  return {
    getName,
    getDueDate,
    getPriority,
    getNotes,
    setName,
    setDueDate,
    setPriority,
    setNotes,
  };
};

export default Todo;
