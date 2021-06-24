import Todo from "./Todo";

const List = function (name) {
  const _name = name;
  const _todos = [];

  function addTodo(name, dueDate, priority, notes) {
    _todos.push(Todo(name, dueDate, priority, notes));
  }

  function getName() {
    return _name;
  }

  function getTodo(name) {
    for (let i = 0; i < _todos.length; i++) {
      if (_todos[i].getName() === name) {
        return _todos[i];
      }
    }
  }

  function getTodos() {
    return _todos;
  }

  function deleteTodo(name) {
    for (let i = 0; i < _todos.length; i++) {
      if (_todos[i].getName() === name) {
        _todos.splice(i, 1);
        return;
      }
    }
  }

  function contains(name) {
    const result = _todos.filter((todo) => todo.getName() === name);
    return result.length === 0 ? false : true;
  }

  return {
    addTodo,
    getName,
    getTodo,
    getTodos,
    deleteTodo,
    contains,
  };
};

export default List;
