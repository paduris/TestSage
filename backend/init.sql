-- Initialize database schema for TestSage

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS repositories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    git_url VARCHAR(255) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    business_domain VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_analyzed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS code_analyses (
    id SERIAL PRIMARY KEY,
    repository_id INTEGER NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    commit_hash VARCHAR(100) NOT NULL,
    analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    risk_score DOUBLE PRECISION,
    diff_content TEXT,
    files_changed INTEGER,
    CONSTRAINT unique_repo_commit UNIQUE (repository_id, commit_hash)
);

CREATE TABLE IF NOT EXISTS risk_areas (
    id SERIAL PRIMARY KEY,
    analysis_id INTEGER NOT NULL REFERENCES code_analyses(id) ON DELETE CASCADE,
    file_path VARCHAR(255) NOT NULL,
    line_numbers VARCHAR(50) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    explanation TEXT
);

CREATE TABLE IF NOT EXISTS risk_area_configs (
    id SERIAL PRIMARY KEY,
    repository_id INTEGER NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    area_pattern VARCHAR(255) NOT NULL,
    risk_weight DOUBLE PRECISION NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS test_suggestions (
    id SERIAL PRIMARY KEY,
    analysis_id INTEGER NOT NULL REFERENCES code_analyses(id) ON DELETE CASCADE,
    test_type VARCHAR(20) NOT NULL,
    test_description TEXT,
    test_code TEXT,
    priority VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for demonstration
INSERT INTO repositories (name, git_url, branch, business_domain, created_at) 
VALUES 
('payment-gateway', 'https://github.com/bank/payment-gateway', 'main', 'BANKING', NOW()),
('user-authentication', 'https://github.com/bank/user-auth', 'develop', 'BANKING', NOW()),
('trading-engine', 'https://github.com/bank/trading-engine', 'main', 'FINTECH', NOW());

-- Insert sample risk area configurations
INSERT INTO risk_area_configs (repository_id, area_pattern, risk_weight, description, is_active)
VALUES
(1, '.*Payment.*\\.java', 2.0, 'Payment processing code is high risk', TRUE),
(1, '.*Security.*\\.java', 1.8, 'Security-related code needs careful testing', TRUE),
(1, '.*Controller\\.java', 1.5, 'API endpoints need validation testing', TRUE),
(2, '.*Auth.*\\.java', 2.0, 'Authentication code is critical', TRUE),
(2, '.*User.*\\.java', 1.5, 'User management requires careful testing', TRUE),
(3, '.*Trade.*\\.java', 2.0, 'Trading logic is high risk', TRUE),
(3, '.*Market.*\\.java', 1.8, 'Market data processing is important', TRUE);