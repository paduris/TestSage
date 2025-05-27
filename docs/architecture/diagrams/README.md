# TestSage System Diagrams

## High-Level Architecture
```mermaid
graph TB
    subgraph Client
        UI[React Frontend]
        Browser[Web Browser]
    end

    subgraph Backend Services
        API[Spring Boot API]
        Auth[Authentication Service]
        Analysis[Code Analysis Service]
        TestGen[Test Generation Service]
        RiskCalc[Risk Calculation Service]
    end

    subgraph Data Storage
        DB[(PostgreSQL Database)]
        Cache[(Redis Cache)]
    end

    subgraph External Services
        Git[Git Repositories]
        AI[OpenAI API]
    end

    Browser --> UI
    UI --> API
    API --> Auth
    API --> Analysis
    API --> TestGen
    API --> RiskCalc
    
    Analysis --> Git
    Analysis --> AI
    TestGen --> AI
    RiskCalc --> DB
    
    API --> DB
    API --> Cache
```

## Component Architecture
```mermaid
graph TB
    subgraph Frontend Components
        RC[Repository Component]
        AC[Analysis Component]
        TC[Test Component]
        DC[Dashboard Component]
        SC[Settings Component]
    end

    subgraph Backend Components
        subgraph Controllers
            RepC[Repository Controller]
            AnaC[Analysis Controller]
            TestC[Test Controller]
            RiskC[Risk Controller]
        end

        subgraph Services
            RepS[Repository Service]
            AnaS[Analysis Service]
            TestS[Test Service]
            RiskS[Risk Service]
        end

        subgraph Repositories
            RepR[Repository Repository]
            AnaR[Analysis Repository]
            TestR[Test Repository]
            RiskR[Risk Repository]
        end
    end

    RC --> RepC
    AC --> AnaC
    TC --> TestC
    DC --> RiskC

    RepC --> RepS
    AnaC --> AnaS
    TestC --> TestS
    RiskC --> RiskS

    RepS --> RepR
    AnaS --> AnaR
    TestS --> TestR
    RiskS --> RiskR
```

## Data Flow Diagram
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API Gateway
    participant Auth Service
    participant Analysis Service
    participant Test Service
    participant Database
    participant OpenAI

    User->>Frontend: Access Application
    Frontend->>Auth Service: Authenticate
    Auth Service-->>Frontend: JWT Token

    User->>Frontend: Request Analysis
    Frontend->>API Gateway: POST /analyze
    API Gateway->>Auth Service: Validate Token
    Auth Service-->>API Gateway: Token Valid
    API Gateway->>Analysis Service: Start Analysis

    Analysis Service->>Database: Get Repository Info
    Database-->>Analysis Service: Repository Data
    Analysis Service->>OpenAI: Analyze Code
    OpenAI-->>Analysis Service: Analysis Results
    Analysis Service->>Database: Store Results
    Analysis Service-->>API Gateway: Analysis Complete
    API Gateway-->>Frontend: Analysis Results
    Frontend-->>User: Display Results

    User->>Frontend: Generate Tests
    Frontend->>API Gateway: POST /generate-tests
    API Gateway->>Test Service: Generate Tests
    Test Service->>Database: Get Analysis Results
    Database-->>Test Service: Analysis Data
    Test Service->>OpenAI: Generate Test Cases
    OpenAI-->>Test Service: Test Cases
    Test Service->>Database: Store Tests
    Test Service-->>API Gateway: Tests Generated
    API Gateway-->>Frontend: Test Results
    Frontend-->>User: Display Tests
```

## Deployment Architecture
```mermaid
graph TB
    subgraph Production Environment
        subgraph Load Balancer
            LB[NGINX Load Balancer]
        end

        subgraph Kubernetes Cluster
            subgraph Frontend Pods
                FP1[Frontend Pod 1]
                FP2[Frontend Pod 2]
            end

            subgraph Backend Pods
                BP1[Backend Pod 1]
                BP2[Backend Pod 2]
            end

            subgraph Database
                M[(Master DB)]
                R1[(Replica 1)]
                R2[(Replica 2)]
            end

            subgraph Cache
                C1[(Redis Primary)]
                C2[(Redis Secondary)]
            end
        end

        subgraph Monitoring
            P[Prometheus]
            G[Grafana]
            ELK[ELK Stack]
        end
    end

    Internet --> LB
    LB --> FP1
    LB --> FP2
    
    FP1 --> BP1
    FP1 --> BP2
    FP2 --> BP1
    FP2 --> BP2
    
    BP1 --> M
    BP2 --> M
    M --> R1
    M --> R2
    
    BP1 --> C1
    BP2 --> C1
    C1 --> C2

    BP1 --> P
    BP2 --> P
    P --> G
    BP1 --> ELK
    BP2 --> ELK
```

## Risk Analysis Flow
```mermaid
graph LR
    subgraph Code Analysis
        A[Code Changes] --> B[Pattern Matching]
        B --> C[Risk Calculation]
        C --> D[Risk Score]
    end

    subgraph Risk Factors
        E[Code Complexity]
        F[Security Patterns]
        G[Test Coverage]
        H[Change Frequency]
    end

    E --> C
    F --> C
    G --> C
    H --> C

    D --> I[Test Generation]
    I --> J[Test Cases]
```

## Test Generation Process
```mermaid
graph TB
    A[Risk Areas] --> B[Context Extraction]
    B --> C[OpenAI Prompt]
    C --> D[Test Generation]
    D --> E[Test Validation]
    E --> F[Test Cases]
    
    subgraph Test Types
        G[Unit Tests]
        H[Integration Tests]
        I[Security Tests]
    end
    
    F --> G
    F --> H
    F --> I
```

## CI/CD Pipeline
```mermaid
graph LR
    A[Code Push] --> B[Build]
    B --> C[Test]
    C --> D[Static Analysis]
    D --> E[Security Scan]
    E --> F[Build Image]
    F --> G[Push Image]
    G --> H[Deploy Dev]
    H --> I[Integration Tests]
    I --> J[Deploy Staging]
    J --> K[E2E Tests]
    K --> L[Deploy Prod]
```
