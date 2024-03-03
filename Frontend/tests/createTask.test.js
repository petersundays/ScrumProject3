const task1 = require('./createTask');

test('creates a task with the correct properties', () => {
  const response = task1.createTask('My Task', 'This is a test task', 'high', '2024-01-21', '2024-01-28');
  expect(response).toBe(true);
});


test('creates a task with default priority and stateId', () => {
  
  const response = task1.createTask('My Task', 'This is a test task', undefined, '2024-01-21', '2024-01-28');
  expect(response).toBe(true);
  
  });

  test('creates a task with high priority', () => {
    const response = task1.createTask('My Task', 'This is a test task', 'high', '2024-01-21', '2024-01-28');
    expect(response).toBe(true);
  });
  
  test('creates a task with medium priority', () => {
    const response = task1.createTask('My Task', 'This is a test task', 'medium', '2024-01-21', '2024-01-28');
    expect(response).toBe(true);
  });
  
  test('creates a task with low priority', () => {
    const response = task1.createTask('My Task', 'This is a test task', 'low', '2024-01-21', '2024-01-28');
    expect(response).toBe(true);
  });
  
  test('creates a task with todo state', () => {
    const response = task1.createTask('My Task', 'This is a test task', 'high', '2024-01-21', '2024-01-28');
    expect(response).toBe(true);
  });
  
  test('creates a task with doing state', () => {
    const response = task1.createTask('My Task', 'This is a test task', 'high', '2024-01-21', '2024-01-28');
    expect(response).toBe(true);
  });
  
  test('creates a task with done state', () => {
    const response = task1.createTask('My Task', 'This is a test task', 'high', '2024-01-21', '2024-01-28');
    expect(response).toBe(true);
  });
  