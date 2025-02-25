import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the fetch API
global.fetch = jest.fn();

describe('Todo App', () => {
  beforeEach(() => {
    // Default mock for fetching tasks
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([
        { id: 1, title: 'Test Task 1', description: 'Description 1' },
        { id: 2, title: 'Test Task 2', description: 'Description 2' }
      ])
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the todo form and task list', async () => {
    render(<App />);
    
    // Check if form elements are rendered
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  test('allows adding a new task', async () => {
    // Mock for the POST request
    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      status: 201
    }));
    
    // Mock for refetching tasks after adding
    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, title: 'Test Task 1', description: 'Description 1' },
        { id: 2, title: 'Test Task 2', description: 'Description 2' },
        { id: 3, title: 'New Task', description: 'New Description' }
      ])
    }));

    render(<App />);
    
    // Wait for initial tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'New Task' }
    });
    
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'New Description' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Add'));
    
    // Check if the new task appears
    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
      expect(screen.getByText('New Description')).toBeInTheDocument();
    });
    
    // Check if fetch was called correctly
    expect(fetch).toHaveBeenCalledWith('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Task', description: 'New Description' })
    });
  });

  test('allows completing a task', async () => {
    // Mock for the PUT request
    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      status: 200
    }));
    
    // Mock for refetching tasks after completing
    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { id: 2, title: 'Test Task 2', description: 'Description 2' }
      ])
    }));

    render(<App />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
    
    // Click the Done button on the first task
    const doneButtons = screen.getAllByText('Done');
    fireEvent.click(doneButtons[0]);
    
    // Check if the task is removed
    await waitFor(() => {
      expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
    
    // Check if fetch was called correctly
    expect(fetch).toHaveBeenCalledWith('/api/tasks/1/complete', {
      method: 'PUT'
    });
  });
});