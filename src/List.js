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

  return {
    addTodo,
    getName,
  };
};

export default List;
