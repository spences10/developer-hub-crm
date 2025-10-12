-- Devhub CRM - Seed Data
-- Comprehensive sample data for testing and demonstration
--
-- USAGE:
-- 1. Register a user account through the UI first
-- 2. Then run: sqlite3 local.db < seed.sql
--
-- This will add sample contacts, interactions, and follow-ups to your account

-- Clear only CRM data (keeps user/auth data)
DELETE FROM contact_tags;
DELETE FROM tags;
DELETE FROM social_links;
DELETE FROM follow_ups;
DELETE FROM interactions;
DELETE FROM contacts;

-- Create contacts (using first user in database)
INSERT INTO contacts (id, user_id, name, email, phone, company, title, github_username, is_vip, birthday, notes, last_contacted_at, created_at, updated_at) VALUES
-- VIP contacts
('contact_001', (SELECT id FROM user LIMIT 1), 'Sarah Chen', 'sarah.chen@techcorp.io', '+1-555-0101', 'TechCorp', 'VP of Engineering', 'sarahchen', 1, '1988-03-15', 'Met at SvelteConf 2024. Very interested in our developer tools. Key decision maker.', CAST(strftime('%s', 'now', '-3 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-3 days') AS INTEGER) * 1000),
('contact_002', (SELECT id FROM user LIMIT 1), 'Marcus Rodriguez', 'marcus@startupxyz.com', '+1-555-0102', 'StartupXYZ', 'CTO & Co-founder', 'mrodriguez', 1, '1985-07-22', 'Early adopter. Loves open source. Invested in developer experience.', CAST(strftime('%s', 'now', '-5 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-170 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-5 days') AS INTEGER) * 1000),
('contact_003', (SELECT id FROM user LIMIT 1), 'Emily Watson', 'e.watson@megadev.com', '+1-555-0103', 'MegaDev Solutions', 'Senior Engineering Manager', 'emilyw', 1, '1990-11-08', 'Leading a team of 25 devs. Looking to improve team collaboration tools.', CAST(strftime('%s', 'now', '-8 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-160 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-8 days') AS INTEGER) * 1000),

-- Regular contacts
('contact_004', (SELECT id FROM user LIMIT 1), 'Alex Kumar', 'alex.k@cloudnative.dev', '+1-555-0104', 'CloudNative Inc', 'Lead Developer', 'alexkumar', 0, '1992-01-30', 'Kubernetes expert. Spoke at KubeCon. Interested in CI/CD improvements.', CAST(strftime('%s', 'now', '-9 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-150 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-9 days') AS INTEGER) * 1000),
('contact_005', (SELECT id FROM user LIMIT 1), 'Jessica Park', 'jpark@designsys.io', '+1-555-0105', 'DesignSys', 'Head of Design Systems', 'jessicapark', 0, '1989-05-12', 'Building design system for 200+ developers. Needs better component documentation.', CAST(strftime('%s', 'now', '-16 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-140 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-16 days') AS INTEGER) * 1000),
('contact_006', (SELECT id FROM user LIMIT 1), 'David Thompson', 'david@fullstack.dev', '+1-555-0106', 'FullStack Labs', 'Principal Engineer', 'dthompson', 0, NULL, 'Full-stack generalist. Works with React, Node, and Python. Open to new tools.', CAST(strftime('%s', 'now', '-17 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-130 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-17 days') AS INTEGER) * 1000),
('contact_007', (SELECT id FROM user LIMIT 1), 'Priya Sharma', 'priya.sharma@aitech.ai', '+1-555-0107', 'AI Tech Solutions', 'ML Engineer', 'priyasharma', 0, '1993-09-25', 'Working on LLM infrastructure. Needs better deployment pipelines.', CAST(strftime('%s', 'now', '-23 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-120 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-23 days') AS INTEGER) * 1000),
('contact_008', (SELECT id FROM user LIMIT 1), 'Tom Anderson', 'tom@gamedev.studio', '+1-555-0108', 'GameDev Studio', 'Senior Game Developer', 'tomanderson', 0, '1987-12-03', 'Unity and Unreal expert. Looking for performance monitoring tools.', CAST(strftime('%s', 'now', '-24 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-110 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-24 days') AS INTEGER) * 1000),
('contact_009', (SELECT id FROM user LIMIT 1), 'Lisa Zhang', 'lzhang@securetech.com', '+1-555-0109', 'SecureTech', 'Security Engineer', 'lisazhang', 0, '1991-04-18', 'Focuses on DevSecOps. Interested in security scanning integrations.', CAST(strftime('%s', 'now', '-30 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-100 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-30 days') AS INTEGER) * 1000),
('contact_010', (SELECT id FROM user LIMIT 1), 'Ryan O''Neill', 'ryan@mobilefirst.app', '+1-555-0110', 'MobileFirst Apps', 'iOS Lead Developer', 'ryanoneill', 0, NULL, 'Swift expert. Building apps for 50M+ users. Needs better crash reporting.', CAST(strftime('%s', 'now', '-31 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-90 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-31 days') AS INTEGER) * 1000),
('contact_011', (SELECT id FROM user LIMIT 1), 'Nina Patel', 'nina.patel@dataflow.io', '+1-555-0111', 'DataFlow Analytics', 'Data Engineer', 'ninapatel', 0, '1990-08-07', 'Building real-time data pipelines. Uses Apache Kafka and Spark.', CAST(strftime('%s', 'now', '-37 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-80 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-37 days') AS INTEGER) * 1000),
('contact_012', (SELECT id FROM user LIMIT 1), 'Chris Martinez', 'chris.m@webscale.com', '+1-555-0112', 'WebScale Inc', 'DevOps Engineer', 'chrismartinez', 0, '1986-02-14', 'Managing infrastructure for high-traffic sites. Docker and Kubernetes pro.', CAST(strftime('%s', 'now', '-44 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-70 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-44 days') AS INTEGER) * 1000),
('contact_013', (SELECT id FROM user LIMIT 1), 'Sophie Laurent', 'sophie@eurotech.eu', '+44-555-0113', 'EuroTech', 'Tech Lead', 'sophielaurent', 0, '1988-10-20', 'Based in Paris. Leading distributed team across Europe. Timezone challenges.', CAST(strftime('%s', 'now', '-51 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-60 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-51 days') AS INTEGER) * 1000),
('contact_014', (SELECT id FROM user LIMIT 1), 'Ahmed Hassan', 'ahmed@innovate.me', '+971-555-0114', 'Innovate Labs', 'Full Stack Developer', 'ahmedhassan', 0, NULL, 'Startup enthusiast. Building fintech solutions. Interested in payment APIs.', CAST(strftime('%s', 'now', '-58 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-50 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-58 days') AS INTEGER) * 1000),
('contact_015', (SELECT id FROM user LIMIT 1), 'Kate Wilson', 'kate@opensource.org', '+1-555-0115', 'OpenSource Foundation', 'Community Manager', 'katewilson', 0, '1994-06-30', 'Manages large OSS community. Needs contributor engagement tools.', CAST(strftime('%s', 'now', '-65 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-40 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-65 days') AS INTEGER) * 1000),
('contact_016', (SELECT id FROM user LIMIT 1), 'James Lee', 'jlee@blockchain.dev', '+1-555-0116', 'BlockChain Ventures', 'Blockchain Developer', 'jameslee', 0, '1989-11-11', 'Smart contract specialist. Works with Ethereum and Solana.', CAST(strftime('%s', 'now', '-72 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-30 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-72 days') AS INTEGER) * 1000),
('contact_017', (SELECT id FROM user LIMIT 1), 'Rachel Green', 'rachel@testing.qa', '+1-555-0117', 'QA Automation Co', 'QA Lead', 'rachelgreen', 0, '1992-03-28', 'Test automation expert. Building testing frameworks. Cypress and Playwright.', CAST(strftime('%s', 'now', '-79 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-20 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-79 days') AS INTEGER) * 1000),
('contact_018', (SELECT id FROM user LIMIT 1), 'Miguel Santos', 'miguel@latamdev.com', '+55-555-0118', 'LatAm Developers', 'Software Architect', 'miguelsantos', 0, NULL, 'Microservices architecture specialist. Based in São Paulo.', CAST(strftime('%s', 'now', '-86 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-10 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-86 days') AS INTEGER) * 1000);

-- Create interactions
INSERT INTO interactions (id, contact_id, type, note, created_at, updated_at) VALUES
-- Sarah Chen (VIP) interactions
('int_001', 'contact_001', 'meeting', 'Initial meeting at SvelteConf. Discussed pain points in their current development workflow. Very interested in our live reload features.', CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000),
('int_002', 'contact_001', 'call', 'Follow-up call. Demoed the product to her team. They loved the TypeScript integration. Scheduled technical deep dive.', CAST(strftime('%s', 'now', '-140 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-140 days') AS INTEGER) * 1000),
('int_003', 'contact_001', 'email', 'Sent pricing proposal for enterprise plan. Included custom training package.', CAST(strftime('%s', 'now', '-70 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-70 days') AS INTEGER) * 1000),
('int_004', 'contact_001', 'meeting', 'Technical deep dive with engineering team. Answered questions about scalability and security. Very positive feedback.', CAST(strftime('%s', 'now', '-3 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-3 days') AS INTEGER) * 1000),

-- Marcus Rodriguez (VIP) interactions
('int_005', 'contact_002', 'coffee', 'Coffee chat at local tech meetup. Talked about startup challenges and developer productivity.', CAST(strftime('%s', 'now', '-170 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-170 days') AS INTEGER) * 1000),
('int_006', 'contact_002', 'call', 'Discussed integration possibilities with their existing stack. They use PostgreSQL and Redis.', CAST(strftime('%s', 'now', '-130 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-130 days') AS INTEGER) * 1000),
('int_007', 'contact_002', 'email', 'Shared case study from similar startup. They found it very relevant.', CAST(strftime('%s', 'now', '-100 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-100 days') AS INTEGER) * 1000),
('int_008', 'contact_002', 'meeting', 'Met at their office. Gave presentation to entire engineering team. Strong interest in adopting our tools.', CAST(strftime('%s', 'now', '-5 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-5 days') AS INTEGER) * 1000),

-- Emily Watson (VIP) interactions
('int_009', 'contact_003', 'call', 'Intro call through mutual connection. Discussed team collaboration challenges with 25 developers.', CAST(strftime('%s', 'now', '-160 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-160 days') AS INTEGER) * 1000),
('int_010', 'contact_003', 'meeting', 'Product demo focusing on team features. She wants better code review workflows.', CAST(strftime('%s', 'now', '-120 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-120 days') AS INTEGER) * 1000),
('int_011', 'contact_003', 'email', 'Sent information about our GitHub integration and review automation features.', CAST(strftime('%s', 'now', '-30 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-30 days') AS INTEGER) * 1000),
('int_012', 'contact_003', 'call', 'Technical Q&A session. Addressed concerns about migration from current tools.', CAST(strftime('%s', 'now', '-8 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-8 days') AS INTEGER) * 1000),

-- Alex Kumar interactions
('int_013', 'contact_004', 'meeting', 'Met at KubeCon. Discussed cloud-native development workflows and CI/CD pain points.', CAST(strftime('%s', 'now', '-150 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-150 days') AS INTEGER) * 1000),
('int_014', 'contact_004', 'email', 'Shared article about Kubernetes best practices. He found it useful.', CAST(strftime('%s', 'now', '-58 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-58 days') AS INTEGER) * 1000),
('int_015', 'contact_004', 'call', 'Talked about Docker optimization and container security. Interested in our scanning features.', CAST(strftime('%s', 'now', '-9 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-9 days') AS INTEGER) * 1000),

-- Jessica Park interactions
('int_016', 'contact_005', 'call', 'Initial call about design system documentation needs. 200+ components to document.', CAST(strftime('%s', 'now', '-140 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-140 days') AS INTEGER) * 1000),
('int_017', 'contact_005', 'meeting', 'Demoed our component documentation features. She wants Storybook integration.', CAST(strftime('%s', 'now', '-51 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-51 days') AS INTEGER) * 1000),
('int_018', 'contact_005', 'email', 'Sent proposal for design system documentation package.', CAST(strftime('%s', 'now', '-16 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-16 days') AS INTEGER) * 1000),

-- David Thompson interactions
('int_019', 'contact_006', 'email', 'Connected on LinkedIn. Introduced our full-stack development tools.', CAST(strftime('%s', 'now', '-130 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-130 days') AS INTEGER) * 1000),
('int_020', 'contact_006', 'call', 'Discussed his React and Node.js projects. Interested in debugging tools.', CAST(strftime('%s', 'now', '-100 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-100 days') AS INTEGER) * 1000),
('int_021', 'contact_006', 'meeting', 'Product walkthrough. Showed advanced debugging and profiling features.', CAST(strftime('%s', 'now', '-17 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-17 days') AS INTEGER) * 1000),

-- Priya Sharma interactions
('int_022', 'contact_007', 'meeting', 'Met at AI/ML conference. Discussed LLM deployment challenges.', CAST(strftime('%s', 'now', '-120 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-120 days') AS INTEGER) * 1000),
('int_023', 'contact_007', 'email', 'Shared resources on ML model deployment and monitoring.', CAST(strftime('%s', 'now', '-23 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-23 days') AS INTEGER) * 1000),

-- Tom Anderson interactions
('int_024', 'contact_008', 'call', 'Intro call about game development tools. Unity performance monitoring.', CAST(strftime('%s', 'now', '-110 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-110 days') AS INTEGER) * 1000),
('int_025', 'contact_008', 'email', 'Sent case study from another game dev studio using our tools.', CAST(strftime('%s', 'now', '-24 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-24 days') AS INTEGER) * 1000),

-- Lisa Zhang interactions
('int_026', 'contact_009', 'meeting', 'Security-focused meeting. Discussed DevSecOps integration and SAST tools.', CAST(strftime('%s', 'now', '-100 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-100 days') AS INTEGER) * 1000),
('int_027', 'contact_009', 'call', 'Technical deep dive on security scanning capabilities. She needs OWASP compliance.', CAST(strftime('%s', 'now', '-30 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-30 days') AS INTEGER) * 1000),

-- Ryan O'Neill interactions
('int_028', 'contact_010', 'call', 'Discussed iOS development challenges. 50M+ users, crash reporting critical.', CAST(strftime('%s', 'now', '-90 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-90 days') AS INTEGER) * 1000),
('int_029', 'contact_010', 'meeting', 'Demoed mobile crash analytics and performance monitoring.', CAST(strftime('%s', 'now', '-31 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-31 days') AS INTEGER) * 1000),

-- Nina Patel interactions
('int_030', 'contact_011', 'meeting', 'Data pipeline discussion. Kafka and Spark integration possibilities.', CAST(strftime('%s', 'now', '-80 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-80 days') AS INTEGER) * 1000),

-- Chris Martinez interactions
('int_031', 'contact_012', 'call', 'DevOps workflows discussion. High-traffic infrastructure challenges.', CAST(strftime('%s', 'now', '-70 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-70 days') AS INTEGER) * 1000),

-- Sophie Laurent interactions
('int_032', 'contact_013', 'email', 'Initial contact about distributed team challenges. Timezone coordination.', CAST(strftime('%s', 'now', '-60 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-60 days') AS INTEGER) * 1000),

-- Ahmed Hassan interactions
('int_033', 'contact_014', 'meeting', 'Fintech startup discussion. Payment API integration needs.', CAST(strftime('%s', 'now', '-50 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-50 days') AS INTEGER) * 1000),

-- Kate Wilson interactions
('int_034', 'contact_015', 'call', 'OSS community management. Contributor engagement tools discussion.', CAST(strftime('%s', 'now', '-40 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-40 days') AS INTEGER) * 1000),

-- James Lee interactions
('int_035', 'contact_016', 'meeting', 'Blockchain development discussion. Smart contract testing needs.', CAST(strftime('%s', 'now', '-30 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-30 days') AS INTEGER) * 1000),

-- Rachel Green interactions
('int_036', 'contact_017', 'call', 'Test automation frameworks. Cypress and Playwright integration.', CAST(strftime('%s', 'now', '-20 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-20 days') AS INTEGER) * 1000),

-- Miguel Santos interactions
('int_037', 'contact_018', 'email', 'Microservices architecture discussion. Service mesh considerations.', CAST(strftime('%s', 'now', '-10 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-10 days') AS INTEGER) * 1000);

-- Create follow-ups
INSERT INTO follow_ups (id, contact_id, due_date, note, completed, completed_at, created_at, updated_at) VALUES
-- Completed follow-ups
('followup_001', 'contact_001', CAST(strftime('%s', 'now', '-140 days') AS INTEGER) * 1000, 'Schedule follow-up call with Sarah after conference', 1, CAST(strftime('%s', 'now', '-141 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-140 days') AS INTEGER) * 1000),
('followup_002', 'contact_001', CAST(strftime('%s', 'now', '-70 days') AS INTEGER) * 1000, 'Send pricing proposal to Sarah', 1, CAST(strftime('%s', 'now', '-71 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-140 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-70 days') AS INTEGER) * 1000),
('followup_003', 'contact_002', CAST(strftime('%s', 'now', '-130 days') AS INTEGER) * 1000, 'Call Marcus about integration', 1, CAST(strftime('%s', 'now', '-131 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-170 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-130 days') AS INTEGER) * 1000),
('followup_004', 'contact_003', CAST(strftime('%s', 'now', '-120 days') AS INTEGER) * 1000, 'Schedule product demo with Emily', 1, CAST(strftime('%s', 'now', '-121 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-160 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-120 days') AS INTEGER) * 1000),
('followup_005', 'contact_004', CAST(strftime('%s', 'now', '-58 days') AS INTEGER) * 1000, 'Send Kubernetes article to Alex', 1, CAST(strftime('%s', 'now', '-59 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-150 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-58 days') AS INTEGER) * 1000),
('followup_006', 'contact_005', CAST(strftime('%s', 'now', '-51 days') AS INTEGER) * 1000, 'Demo component docs to Jessica', 1, CAST(strftime('%s', 'now', '-52 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-140 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-51 days') AS INTEGER) * 1000),
('followup_007', 'contact_006', CAST(strftime('%s', 'now', '-100 days') AS INTEGER) * 1000, 'Call David about React debugging', 1, CAST(strftime('%s', 'now', '-101 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-130 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-100 days') AS INTEGER) * 1000),

-- Overdue follow-ups (just 2)
('followup_008', 'contact_006', CAST(strftime('%s', 'now', '-3 days') AS INTEGER) * 1000, 'Schedule advanced debugging demo with David', 0, NULL, CAST(strftime('%s', 'now', '-17 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-17 days') AS INTEGER) * 1000),
('followup_009', 'contact_009', CAST(strftime('%s', 'now', '-7 days') AS INTEGER) * 1000, 'Check if Lisa needs OWASP compliance docs', 0, NULL, CAST(strftime('%s', 'now', '-30 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-30 days') AS INTEGER) * 1000),

-- Upcoming follow-ups (next 2 weeks)
('followup_010', 'contact_001', CAST(strftime('%s', 'now', '+1 day') AS INTEGER) * 1000, 'Follow up on enterprise proposal with Sarah', 0, NULL, CAST(strftime('%s', 'now', '-3 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-3 days') AS INTEGER) * 1000),
('followup_011', 'contact_002', CAST(strftime('%s', 'now', '+2 days') AS INTEGER) * 1000, 'Check in with Marcus about team decision', 0, NULL, CAST(strftime('%s', 'now', '-5 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-5 days') AS INTEGER) * 1000),
('followup_012', 'contact_003', CAST(strftime('%s', 'now', '+3 days') AS INTEGER) * 1000, 'Send migration guide to Emily', 0, NULL, CAST(strftime('%s', 'now', '-8 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-8 days') AS INTEGER) * 1000),
('followup_013', 'contact_004', CAST(strftime('%s', 'now', '+4 days') AS INTEGER) * 1000, 'Share security scanning docs with Alex', 0, NULL, CAST(strftime('%s', 'now', '-9 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-9 days') AS INTEGER) * 1000),
('followup_014', 'contact_005', CAST(strftime('%s', 'now', '+5 days') AS INTEGER) * 1000, 'Send Storybook integration pricing to Jessica', 0, NULL, CAST(strftime('%s', 'now', '-16 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-16 days') AS INTEGER) * 1000),
('followup_015', 'contact_007', CAST(strftime('%s', 'now', '+6 days') AS INTEGER) * 1000, 'Follow up on ML deployment discussion with Priya', 0, NULL, CAST(strftime('%s', 'now', '-23 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-23 days') AS INTEGER) * 1000),
('followup_016', 'contact_008', CAST(strftime('%s', 'now', '+7 days') AS INTEGER) * 1000, 'Send contract to Tom for mobile monitoring', 0, NULL, CAST(strftime('%s', 'now', '-24 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-24 days') AS INTEGER) * 1000),
('followup_017', 'contact_010', CAST(strftime('%s', 'now', '+10 days') AS INTEGER) * 1000, 'Review crash analytics trial results with Ryan', 0, NULL, CAST(strftime('%s', 'now', '-31 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-31 days') AS INTEGER) * 1000),
('followup_018', 'contact_011', CAST(strftime('%s', 'now', '+12 days') AS INTEGER) * 1000, 'Discuss Kafka integration with Nina', 0, NULL, CAST(strftime('%s', 'now', '-37 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-37 days') AS INTEGER) * 1000),
('followup_019', 'contact_012', CAST(strftime('%s', 'now', '+14 days') AS INTEGER) * 1000, 'Share infrastructure case study with Chris', 0, NULL, CAST(strftime('%s', 'now', '-44 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-44 days') AS INTEGER) * 1000),
('followup_020', 'contact_013', CAST(strftime('%s', 'now', '+18 days') AS INTEGER) * 1000, 'Schedule timezone-friendly call with Sophie', 0, NULL, CAST(strftime('%s', 'now', '-51 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-51 days') AS INTEGER) * 1000);

-- Create social links
INSERT INTO social_links (id, contact_id, platform, url, created_at) VALUES
-- Sarah Chen
('social_001', 'contact_001', 'github', 'https://github.com/sarahchen', CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000),
('social_002', 'contact_001', 'linkedin', 'https://linkedin.com/in/sarahchen', CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000),
('social_003', 'contact_001', 'twitter', 'https://twitter.com/sarahchen', CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000),

-- Marcus Rodriguez
('social_004', 'contact_002', 'github', 'https://github.com/mrodriguez', CAST(strftime('%s', 'now', '-170 days') AS INTEGER) * 1000),
('social_005', 'contact_002', 'linkedin', 'https://linkedin.com/in/marcusrodriguez', CAST(strftime('%s', 'now', '-170 days') AS INTEGER) * 1000),

-- Emily Watson
('social_006', 'contact_003', 'github', 'https://github.com/emilyw', CAST(strftime('%s', 'now', '-160 days') AS INTEGER) * 1000),
('social_007', 'contact_003', 'linkedin', 'https://linkedin.com/in/emilywatson', CAST(strftime('%s', 'now', '-160 days') AS INTEGER) * 1000),

-- Alex Kumar
('social_008', 'contact_004', 'github', 'https://github.com/alexkumar', CAST(strftime('%s', 'now', '-150 days') AS INTEGER) * 1000),
('social_009', 'contact_004', 'twitter', 'https://twitter.com/alexkumar', CAST(strftime('%s', 'now', '-150 days') AS INTEGER) * 1000),

-- Jessica Park
('social_010', 'contact_005', 'github', 'https://github.com/jessicapark', CAST(strftime('%s', 'now', '-140 days') AS INTEGER) * 1000),
('social_011', 'contact_005', 'dribbble', 'https://dribbble.com/jessicapark', CAST(strftime('%s', 'now', '-140 days') AS INTEGER) * 1000),

-- David Thompson
('social_012', 'contact_006', 'github', 'https://github.com/dthompson', CAST(strftime('%s', 'now', '-130 days') AS INTEGER) * 1000),

-- Priya Sharma
('social_013', 'contact_007', 'github', 'https://github.com/priyasharma', CAST(strftime('%s', 'now', '-120 days') AS INTEGER) * 1000),
('social_014', 'contact_007', 'linkedin', 'https://linkedin.com/in/priyasharma', CAST(strftime('%s', 'now', '-120 days') AS INTEGER) * 1000),

-- Tom Anderson
('social_015', 'contact_008', 'github', 'https://github.com/tomanderson', CAST(strftime('%s', 'now', '-110 days') AS INTEGER) * 1000),

-- Lisa Zhang
('social_016', 'contact_009', 'github', 'https://github.com/lisazhang', CAST(strftime('%s', 'now', '-100 days') AS INTEGER) * 1000),
('social_017', 'contact_009', 'linkedin', 'https://linkedin.com/in/lisazhang', CAST(strftime('%s', 'now', '-100 days') AS INTEGER) * 1000),

-- Ryan O'Neill
('social_018', 'contact_010', 'github', 'https://github.com/ryanoneill', CAST(strftime('%s', 'now', '-90 days') AS INTEGER) * 1000),
('social_019', 'contact_010', 'twitter', 'https://twitter.com/ryanoneill', CAST(strftime('%s', 'now', '-90 days') AS INTEGER) * 1000),

-- Nina Patel
('social_020', 'contact_011', 'github', 'https://github.com/ninapatel', CAST(strftime('%s', 'now', '-80 days') AS INTEGER) * 1000),

-- Chris Martinez
('social_021', 'contact_012', 'github', 'https://github.com/chrismartinez', CAST(strftime('%s', 'now', '-70 days') AS INTEGER) * 1000),

-- Sophie Laurent
('social_022', 'contact_013', 'github', 'https://github.com/sophielaurent', CAST(strftime('%s', 'now', '-60 days') AS INTEGER) * 1000),
('social_023', 'contact_013', 'linkedin', 'https://linkedin.com/in/sophielaurent', CAST(strftime('%s', 'now', '-60 days') AS INTEGER) * 1000),

-- Ahmed Hassan
('social_024', 'contact_014', 'github', 'https://github.com/ahmedhassan', CAST(strftime('%s', 'now', '-50 days') AS INTEGER) * 1000),

-- Kate Wilson
('social_025', 'contact_015', 'github', 'https://github.com/katewilson', CAST(strftime('%s', 'now', '-40 days') AS INTEGER) * 1000),
('social_026', 'contact_015', 'twitter', 'https://twitter.com/katewilson', CAST(strftime('%s', 'now', '-40 days') AS INTEGER) * 1000),

-- James Lee
('social_027', 'contact_016', 'github', 'https://github.com/jameslee', CAST(strftime('%s', 'now', '-30 days') AS INTEGER) * 1000),

-- Rachel Green
('social_028', 'contact_017', 'github', 'https://github.com/rachelgreen', CAST(strftime('%s', 'now', '-20 days') AS INTEGER) * 1000),
('social_029', 'contact_017', 'linkedin', 'https://linkedin.com/in/rachelgreen', CAST(strftime('%s', 'now', '-20 days') AS INTEGER) * 1000),

-- Miguel Santos
('social_030', 'contact_018', 'github', 'https://github.com/miguelsantos', CAST(strftime('%s', 'now', '-10 days') AS INTEGER) * 1000),
('social_031', 'contact_018', 'linkedin', 'https://linkedin.com/in/miguelsantos', CAST(strftime('%s', 'now', '-10 days') AS INTEGER) * 1000);

-- Create tags
INSERT INTO tags (id, user_id, name, color, created_at, updated_at) VALUES
-- Relationship stage tags
('tag_001', (SELECT id FROM user LIMIT 1), 'Hot Lead', '#ef4444', CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000),
('tag_002', (SELECT id FROM user LIMIT 1), 'Active', '#22c55e', CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000),
('tag_003', (SELECT id FROM user LIMIT 1), 'Exploring', '#3b82f6', CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000),

-- Conference tags
('tag_004', (SELECT id FROM user LIMIT 1), 'SvelteConf 2024', '#ff3e00', CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000),
('tag_005', (SELECT id FROM user LIMIT 1), 'KubeCon', '#326ce5', CAST(strftime('%s', 'now', '-150 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-150 days') AS INTEGER) * 1000),
('tag_006', (SELECT id FROM user LIMIT 1), 'Conference', '#a855f7', CAST(strftime('%s', 'now', '-120 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-120 days') AS INTEGER) * 1000),

-- Company type tags
('tag_007', (SELECT id FROM user LIMIT 1), 'Startup', '#f59e0b', CAST(strftime('%s', 'now', '-170 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-170 days') AS INTEGER) * 1000),
('tag_008', (SELECT id FROM user LIMIT 1), 'Enterprise', '#8b5cf6', CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000),

-- Role tags
('tag_009', (SELECT id FROM user LIMIT 1), 'Leadership', '#dc2626', CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000),
('tag_010', (SELECT id FROM user LIMIT 1), 'Founder', '#ea580c', CAST(strftime('%s', 'now', '-170 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-170 days') AS INTEGER) * 1000),

-- Tech/Interest tags
('tag_011', (SELECT id FROM user LIMIT 1), 'Open Source', '#10b981', CAST(strftime('%s', 'now', '-170 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-170 days') AS INTEGER) * 1000),
('tag_012', (SELECT id FROM user LIMIT 1), 'DevOps', '#0ea5e9', CAST(strftime('%s', 'now', '-150 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-150 days') AS INTEGER) * 1000),
('tag_013', (SELECT id FROM user LIMIT 1), 'AI/ML', '#ec4899', CAST(strftime('%s', 'now', '-120 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-120 days') AS INTEGER) * 1000),
('tag_014', (SELECT id FROM user LIMIT 1), 'Security', '#dc2626', CAST(strftime('%s', 'now', '-100 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-100 days') AS INTEGER) * 1000),
('tag_015', (SELECT id FROM user LIMIT 1), 'Frontend', '#06b6d4', CAST(strftime('%s', 'now', '-140 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-140 days') AS INTEGER) * 1000),
('tag_016', (SELECT id FROM user LIMIT 1), 'Design Systems', '#a78bfa', CAST(strftime('%s', 'now', '-140 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-140 days') AS INTEGER) * 1000),
('tag_017', (SELECT id FROM user LIMIT 1), 'Mobile', '#f97316', CAST(strftime('%s', 'now', '-90 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-90 days') AS INTEGER) * 1000),
('tag_018', (SELECT id FROM user LIMIT 1), 'Data Engineering', '#6366f1', CAST(strftime('%s', 'now', '-80 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-80 days') AS INTEGER) * 1000),
('tag_019', (SELECT id FROM user LIMIT 1), 'Blockchain', '#eab308', CAST(strftime('%s', 'now', '-30 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-30 days') AS INTEGER) * 1000),
('tag_020', (SELECT id FROM user LIMIT 1), 'Testing', '#14b8a6', CAST(strftime('%s', 'now', '-20 days') AS INTEGER) * 1000, CAST(strftime('%s', 'now', '-20 days') AS INTEGER) * 1000);

-- Create contact tags (assign tags to contacts)
INSERT INTO contact_tags (id, contact_id, tag_id, created_at) VALUES
-- Sarah Chen (VIP, Enterprise, Leadership, Conference)
('ct_001', 'contact_001', 'tag_001', CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000), -- Hot Lead
('ct_002', 'contact_001', 'tag_004', CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000), -- SvelteConf 2024
('ct_003', 'contact_001', 'tag_008', CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000), -- Enterprise
('ct_004', 'contact_001', 'tag_009', CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000), -- Leadership
('ct_005', 'contact_001', 'tag_015', CAST(strftime('%s', 'now', '-180 days') AS INTEGER) * 1000), -- Frontend

-- Marcus Rodriguez (VIP, Startup, Founder, Open Source)
('ct_006', 'contact_002', 'tag_002', CAST(strftime('%s', 'now', '-170 days') AS INTEGER) * 1000), -- Active
('ct_007', 'contact_002', 'tag_007', CAST(strftime('%s', 'now', '-170 days') AS INTEGER) * 1000), -- Startup
('ct_008', 'contact_002', 'tag_010', CAST(strftime('%s', 'now', '-170 days') AS INTEGER) * 1000), -- Founder
('ct_009', 'contact_002', 'tag_011', CAST(strftime('%s', 'now', '-170 days') AS INTEGER) * 1000), -- Open Source

-- Emily Watson (VIP, Enterprise, Leadership)
('ct_010', 'contact_003', 'tag_001', CAST(strftime('%s', 'now', '-160 days') AS INTEGER) * 1000), -- Hot Lead
('ct_011', 'contact_003', 'tag_008', CAST(strftime('%s', 'now', '-160 days') AS INTEGER) * 1000), -- Enterprise
('ct_012', 'contact_003', 'tag_009', CAST(strftime('%s', 'now', '-160 days') AS INTEGER) * 1000), -- Leadership

-- Alex Kumar (DevOps, Conference)
('ct_013', 'contact_004', 'tag_005', CAST(strftime('%s', 'now', '-150 days') AS INTEGER) * 1000), -- KubeCon
('ct_014', 'contact_004', 'tag_012', CAST(strftime('%s', 'now', '-150 days') AS INTEGER) * 1000), -- DevOps
('ct_015', 'contact_004', 'tag_003', CAST(strftime('%s', 'now', '-150 days') AS INTEGER) * 1000), -- Exploring

-- Jessica Park (Design Systems, Frontend)
('ct_016', 'contact_005', 'tag_016', CAST(strftime('%s', 'now', '-140 days') AS INTEGER) * 1000), -- Design Systems
('ct_017', 'contact_005', 'tag_015', CAST(strftime('%s', 'now', '-140 days') AS INTEGER) * 1000), -- Frontend
('ct_018', 'contact_005', 'tag_003', CAST(strftime('%s', 'now', '-140 days') AS INTEGER) * 1000), -- Exploring

-- David Thompson (Frontend)
('ct_019', 'contact_006', 'tag_015', CAST(strftime('%s', 'now', '-130 days') AS INTEGER) * 1000), -- Frontend
('ct_020', 'contact_006', 'tag_003', CAST(strftime('%s', 'now', '-130 days') AS INTEGER) * 1000), -- Exploring

-- Priya Sharma (AI/ML)
('ct_021', 'contact_007', 'tag_013', CAST(strftime('%s', 'now', '-120 days') AS INTEGER) * 1000), -- AI/ML
('ct_022', 'contact_007', 'tag_006', CAST(strftime('%s', 'now', '-120 days') AS INTEGER) * 1000), -- Conference
('ct_023', 'contact_007', 'tag_003', CAST(strftime('%s', 'now', '-120 days') AS INTEGER) * 1000), -- Exploring

-- Tom Anderson (Mobile)
('ct_024', 'contact_008', 'tag_017', CAST(strftime('%s', 'now', '-110 days') AS INTEGER) * 1000), -- Mobile
('ct_025', 'contact_008', 'tag_003', CAST(strftime('%s', 'now', '-110 days') AS INTEGER) * 1000), -- Exploring

-- Lisa Zhang (Security, DevOps)
('ct_026', 'contact_009', 'tag_014', CAST(strftime('%s', 'now', '-100 days') AS INTEGER) * 1000), -- Security
('ct_027', 'contact_009', 'tag_012', CAST(strftime('%s', 'now', '-100 days') AS INTEGER) * 1000), -- DevOps
('ct_028', 'contact_009', 'tag_003', CAST(strftime('%s', 'now', '-100 days') AS INTEGER) * 1000), -- Exploring

-- Ryan O'Neill (Mobile)
('ct_029', 'contact_010', 'tag_017', CAST(strftime('%s', 'now', '-90 days') AS INTEGER) * 1000), -- Mobile
('ct_030', 'contact_010', 'tag_003', CAST(strftime('%s', 'now', '-90 days') AS INTEGER) * 1000), -- Exploring

-- Nina Patel (Data Engineering)
('ct_031', 'contact_011', 'tag_018', CAST(strftime('%s', 'now', '-80 days') AS INTEGER) * 1000), -- Data Engineering
('ct_032', 'contact_011', 'tag_003', CAST(strftime('%s', 'now', '-80 days') AS INTEGER) * 1000), -- Exploring

-- Chris Martinez (DevOps)
('ct_033', 'contact_012', 'tag_012', CAST(strftime('%s', 'now', '-70 days') AS INTEGER) * 1000), -- DevOps
('ct_034', 'contact_012', 'tag_003', CAST(strftime('%s', 'now', '-70 days') AS INTEGER) * 1000), -- Exploring

-- Sophie Laurent (Leadership)
('ct_035', 'contact_013', 'tag_009', CAST(strftime('%s', 'now', '-60 days') AS INTEGER) * 1000), -- Leadership
('ct_036', 'contact_013', 'tag_003', CAST(strftime('%s', 'now', '-60 days') AS INTEGER) * 1000), -- Exploring

-- Ahmed Hassan (Startup)
('ct_037', 'contact_014', 'tag_007', CAST(strftime('%s', 'now', '-50 days') AS INTEGER) * 1000), -- Startup
('ct_038', 'contact_014', 'tag_003', CAST(strftime('%s', 'now', '-50 days') AS INTEGER) * 1000), -- Exploring

-- Kate Wilson (Open Source)
('ct_039', 'contact_015', 'tag_011', CAST(strftime('%s', 'now', '-40 days') AS INTEGER) * 1000), -- Open Source
('ct_040', 'contact_015', 'tag_003', CAST(strftime('%s', 'now', '-40 days') AS INTEGER) * 1000), -- Exploring

-- James Lee (Blockchain)
('ct_041', 'contact_016', 'tag_019', CAST(strftime('%s', 'now', '-30 days') AS INTEGER) * 1000), -- Blockchain
('ct_042', 'contact_016', 'tag_003', CAST(strftime('%s', 'now', '-30 days') AS INTEGER) * 1000), -- Exploring

-- Rachel Green (Testing)
('ct_043', 'contact_017', 'tag_020', CAST(strftime('%s', 'now', '-20 days') AS INTEGER) * 1000), -- Testing
('ct_044', 'contact_017', 'tag_003', CAST(strftime('%s', 'now', '-20 days') AS INTEGER) * 1000), -- Exploring

-- Miguel Santos (Startup)
('ct_045', 'contact_018', 'tag_007', CAST(strftime('%s', 'now', '-10 days') AS INTEGER) * 1000), -- Startup
('ct_046', 'contact_018', 'tag_003', CAST(strftime('%s', 'now', '-10 days') AS INTEGER) * 1000); -- Exploring

-- Summary
-- Contacts: 18 contacts (3 VIP, 15 regular)
-- Interactions: 37 interactions (meetings, calls, emails, coffee chats)
-- Follow-ups: 20 follow-ups (7 completed, 2 overdue, 11 upcoming)
-- Social Links: 31 social links (GitHub, LinkedIn, Twitter, Dribbble)
-- Tags: 20 tags (relationship stages, conferences, company types, roles, tech interests)
-- Contact Tags: 46 tag assignments
