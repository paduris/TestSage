# TestSage Development Guide

## Development Environment Setup

### Required Tools
- Java Development Kit (JDK) 17
- Node.js 18+
- Docker Desktop
- Git
- IDE (recommended: IntelliJ IDEA, VS Code)
- PostgreSQL (optional if using Docker)

### IDE Setup

#### IntelliJ IDEA
1. Install plugins:
   - Spring Boot Assistant
   - Lombok
   - Docker
   - SonarLint

2. Import project:
   - File → Open
   - Select the `TestSage` directory
   - Import as Maven project

#### VS Code
1. Install extensions:
   - Java Extension Pack
   - Spring Boot Extension Pack
   - ESLint
   - Prettier
   - Docker

### Code Style Guidelines

#### Java Code Style
- Follow Google Java Style Guide
- Use lombok for boilerplate reduction
- Maximum line length: 120 characters
- Use meaningful variable names
- Document public APIs

Example:
```java
@Getter
@Setter
@Entity
public class Repository {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 255)
    private String name;

    @NotNull
    @URL
    private String gitUrl;

    // ... other fields
}
```

#### JavaScript/React Code Style
- Use ESLint with Airbnb config
- Use Prettier for formatting
- Use functional components
- Use TypeScript for type safety

Example:
```typescript
interface RepositoryProps {
  name: string;
  gitUrl: string;
  onAnalyze: () => void;
}

const Repository: React.FC<RepositoryProps> = ({ name, gitUrl, onAnalyze }) => {
  return (
    <div className="repository">
      <h2>{name}</h2>
      <p>{gitUrl}</p>
      <button onClick={onAnalyze}>Analyze</button>
    </div>
  );
};
```

### Git Workflow

1. Branch naming convention:
   - Feature: `feature/description`
   - Bug fix: `fix/description`
   - Hotfix: `hotfix/description`
   - Release: `release/version`

2. Commit message format:
   ```
   type(scope): description

   [optional body]

   [optional footer]
   ```
   Types: feat, fix, docs, style, refactor, test, chore

3. Pull Request process:
   - Create branch from main
   - Make changes
   - Run tests
   - Create PR
   - Get code review
   - Merge after approval

### Testing Guidelines

#### Backend Testing
1. Unit Tests:
```java
@SpringBootTest
class RepositoryServiceTest {
    @Autowired
    private RepositoryService service;

    @Test
    void shouldCreateRepository() {
        Repository repo = new Repository();
        repo.setName("Test");
        repo.setGitUrl("https://github.com/test/test");
        
        Repository saved = service.create(repo);
        assertNotNull(saved.getId());
    }
}
```

2. Integration Tests:
```java
@SpringBootTest
@AutoConfigureMockMvc
class RepositoryControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldGetRepository() throws Exception {
        mockMvc.perform(get("/api/repositories/1"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.name").exists());
    }
}
```

#### Frontend Testing
1. Component Tests:
```javascript
import { render, screen } from '@testing-library/react';
import Repository from './Repository';

test('renders repository name', () => {
  render(<Repository name="Test Repo" gitUrl="https://github.com/test" />);
  expect(screen.getByText('Test Repo')).toBeInTheDocument();
});
```

2. Integration Tests:
```javascript
import { renderWithRouter } from '../test-utils';
import RepositoryList from './RepositoryList';

test('loads and displays repositories', async () => {
  renderWithRouter(<RepositoryList />);
  expect(await screen.findByText('Loading...')).toBeInTheDocument();
  expect(await screen.findByText('Test Repo')).toBeInTheDocument();
});
```

### Database Management

1. Flyway migrations:
```sql
-- V1__create_repositories.sql
CREATE TABLE repositories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    git_url VARCHAR(255) NOT NULL,
    branch VARCHAR(255) NOT NULL DEFAULT 'main',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

2. JPA entities:
```java
@Entity
@Table(name = "repositories")
public class Repository {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "git_url", nullable = false)
    private String gitUrl;

    // ... other fields
}
```

### API Development

1. Controller structure:
```java
@RestController
@RequestMapping("/api/repositories")
public class RepositoryController {
    private final RepositoryService service;

    @GetMapping("/{id}")
    public ResponseEntity<Repository> getRepository(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<Repository> createRepository(@RequestBody Repository repo) {
        return ResponseEntity.status(201).body(service.create(repo));
    }
}
```

2. Service layer:
```java
@Service
@Transactional
public class RepositoryService {
    private final RepositoryRepository repository;

    public Repository create(Repository repo) {
        // Validation logic
        return repository.save(repo);
    }
}
```

### Error Handling

1. Global exception handler:
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(NotFoundException ex) {
        return ResponseEntity
            .status(404)
            .body(new ErrorResponse("NOT_FOUND", ex.getMessage()));
    }
}
```

2. Custom exceptions:
```java
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}
```

### Logging

1. Backend logging:
```java
@Slf4j
@Service
public class AnalysisService {
    public void analyze(Long repoId) {
        log.info("Starting analysis for repository {}", repoId);
        try {
            // Analysis logic
        } catch (Exception e) {
            log.error("Analysis failed for repository {}", repoId, e);
            throw e;
        }
    }
}
```

2. Frontend logging:
```javascript
import { logger } from '../utils/logger';

function AnalysisComponent() {
  const startAnalysis = async () => {
    try {
      logger.info('Starting analysis');
      // Analysis logic
    } catch (error) {
      logger.error('Analysis failed', { error });
    }
  };
}
```

### Performance Optimization

1. Backend optimization:
   - Use caching where appropriate
   - Implement pagination
   - Optimize database queries
   - Use async operations

2. Frontend optimization:
   - Implement code splitting
   - Use React.memo for expensive components
   - Optimize images and assets
   - Use service workers for caching

### Security Best Practices

1. Input validation:
```java
@PostMapping
public ResponseEntity<Repository> create(@Valid @RequestBody Repository repo) {
    return ResponseEntity.ok(service.create(repo));
}
```

2. CORS configuration:
```java
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        http.cors()
            .and()
            .csrf().disable()
            .authorizeRequests()
            .anyRequest().authenticated();
        return http.build();
    }
}
```

### Monitoring and Debugging

1. Actuator endpoints:
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus
```

2. Custom metrics:
```java
@Component
public class AnalysisMetrics {
    private final MeterRegistry registry;

    public void recordAnalysisTime(long milliseconds) {
        registry.timer("analysis.duration").record(milliseconds, TimeUnit.MILLISECONDS);
    }
}
```
