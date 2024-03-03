function parsePriorityToInt (priority) {
  let newPriority = 0;
  if(priority === 'low') {
    newPriority = 100;
  } else if(priority === 'medium') {
    newPriority = 200;
  } else if(priority === 'high') {
    newPriority = 300;
  }
  return newPriority;
}

function parseStateIdToInt (stateId) {
  let newStateId = 0;
  if(stateId === 'todo') {
    newStateId = 100;
  } else if(stateId === 'doing') {
    newStateId = 200;
  } else if(stateId === 'done') {
    newStateId = 300;
  }
  return newStateId;
}

function createTask(title, description, priority, startDate, limitDate) { // Cria uma nova task com os dados inseridos pelo utilizador
    let todoStateId = 'todo';
    let newPriority = parsePriorityToInt(priority);
    const task = {
    title: title,
    description: description,
    stateId: parseStateIdToInt(todoStateId),
    priority: newPriority,
    startDate: startDate,
    limitDate: limitDate
    }

    var taskCreated = false; 
    if (task != null) {
      taskCreated = true;
    } 
    return taskCreated;
  }
  module.exports = {createTask};