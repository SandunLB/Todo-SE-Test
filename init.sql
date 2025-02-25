CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT FALSE
);

-- Index for getting most recent incomplete tasks
CREATE INDEX idx_tasks_completed_created 
ON tasks(is_completed, created_at DESC);

-- Add some sample data
INSERT INTO tasks (title, description) VALUES
    ('Buy books', 'Buy books for the next school year'),
    ('Clean home', 'Need to clean the bed room'),
    ('Takehome assignment', 'Finish the rest room assignment'),
    ('Play Cricket', 'Plan the soft ball cricket match on next Sunday'),
    ('Help Saman', 'Saman need help with his software project');