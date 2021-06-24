import PubSub from "pubsub-js";

const InputValidator = (function () {
  function init() {
    validateListName();
    validateTodoName();
  }

  function validateListName() {
    const TOPIC = "validateListName";

    PubSub.subscribe(TOPIC, (msg, name) => {
      const NEW_TOPIC = isValid(name, 20) ? "listNameValid" : "listNameInvalid";
      PubSub.publish(NEW_TOPIC, name);
    });
  }

  function validateTodoName() {
    const TOPIC = "validateTodoName";
    let NEW_TOPIC;

    PubSub.subscribe(TOPIC, (msg, data) => {
      const mode = data.mode;

      if (isValid(data.form.name, 25) && mode === "New") {
        NEW_TOPIC = "newTodoNameValid";
      } else if (isValid(data.form.name, 25) && mode === "Edit") {
        NEW_TOPIC = "editedNameValid";
      } else {
        NEW_TOPIC = "todoNameInvalid";
      }

      PubSub.publish(NEW_TOPIC, data);
    });
  }

  // Helper functions
  function isValid(string, maxCharacters) {
    return string.length >= 1 && string.length <= maxCharacters;
  }

  return {
    init,
  };
})();

export default InputValidator;
