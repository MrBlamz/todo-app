import PubSub from "pubsub-js";

const InputValidator = (function () {
  function init() {
    validateListName();
  }

  function validateListName() {
    const TOPIC = "validateListName";

    PubSub.subscribe(TOPIC, (msg, name) => {
      const NEW_TOPIC = isValid(name, 20) ? "listNameValid" : "listNameInvalid";
      PubSub.publish(NEW_TOPIC, name);
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
