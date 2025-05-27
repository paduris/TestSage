# TestSage Architecture

## System Architecture
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  Spring Backend │────▶│  Spring AI      │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                      │                       │
         │                      │                       │
         │                      ▼                       │
         │              ┌─────────────────┐            │
         │              │                 │            │
         └─────────────▶│  PostgreSQL DB  │◀───────────┘
                        │                 │
                        └─────────────────┘
                               │
                               │
                               ▼
                      ┌─────────────────┐
                      │                 │
                      │  Git Repos      │
                      │                 │
                      └─────────────────┘
```

## Component Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│ Frontend (React)                                                │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ Repository  │    │ Analysis    │    │ Test        │         │
│  │ Management  │    │ Dashboard   │    │ Suggestions │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Backend (Spring Boot)                                           │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ Repository  │    │ Code Diff   │    │ Risk Score  │         │
│  │ Service     │    │ Analyzer    │    │ Calculator  │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ Test Case   │    │ CI/CD       │    │ Spring AI   │         │
│  │ Generator   │    │ Integration │    │ Service     │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Database (PostgreSQL)                                           │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ Repositories│    │ Analysis    │    │ Test        │         │
│  │ Table       │    │ Results     │    │ Suggestions │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐                            │
│  │ Risk Areas  │    │ Code Diffs  │                            │
│  │ Config      │    │ History     │                            │
│  └─────────────┘    └─────────────┘                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Flow Diagram
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  Register   │────▶│  Analyze    │────▶│  Calculate  │────▶│  Generate   │
│  Repository │     │  Code Diffs │     │  Risk Score │     │  Test Cases │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                   │
                                                                   │
                                                                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  View       │◀────│  Integrate  │◀────│  Run        │◀────│  Review     │
│  Dashboard  │     │  with CI/CD │     │  Tests      │     │  Suggestions│
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

## Data Model
```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ Repository      │       │ CodeAnalysis    │       │ TestSuggestion  │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │       │ id              │
│ name            │       │ repositoryId    │       │ analysisId      │
│ gitUrl          │       │ commitHash      │       │ testType        │
│ branch          │       │ analysisDate    │       │ testDescription │
│ businessDomain  │       │ riskScore       │       │ testCode        │
│ createdAt       │       │ diffContent     │       │ priority        │
│ lastAnalyzedAt  │       │ filesChanged    │       │ createdAt       │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                  │
                                  │
                                  ▼
┌─────────────────┐       ┌─────────────────┐
│ RiskArea        │       │ RiskAreaConfig  │
├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │
│ analysisId      │       │ repositoryId    │
│ filePath        │       │ areaPattern     │
│ lineNumbers     │       │ riskWeight      │
│ riskLevel       │       │ description     │
│ explanation     │       │ isActive        │
└─────────────────┘       └─────────────────┘
```
