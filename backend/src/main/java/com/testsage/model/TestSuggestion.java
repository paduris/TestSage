package com.testsage.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "test_suggestions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestSuggestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "analysis_id", nullable = false)
    private CodeAnalysis analysis;

    @Column(name = "test_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private TestType testType;

    @Column(name = "test_description", columnDefinition = "TEXT")
    private String testDescription;

    @Column(name = "test_code", columnDefinition = "TEXT")
    private String testCode;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Explicit getters and setters to ensure they're available
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CodeAnalysis getAnalysis() {
        return analysis;
    }

    public void setAnalysis(CodeAnalysis analysis) {
        this.analysis = analysis;
    }

    public TestType getTestType() {
        return testType;
    }

    public void setTestType(TestType testType) {
        this.testType = testType;
    }

    public String getTestDescription() {
        return testDescription;
    }

    public void setTestDescription(String testDescription) {
        this.testDescription = testDescription;
    }

    public String getTestCode() {
        return testCode;
    }

    public void setTestCode(String testCode) {
        this.testCode = testCode;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    // Static builder method to ensure the builder pattern works
    public static TestSuggestionBuilder builder() {
        return new TestSuggestionBuilder();
    }
    
    // Custom builder class to ensure the builder pattern works
    public static class TestSuggestionBuilder {
        private Long id;
        private CodeAnalysis analysis;
        private TestType testType;
        private String testDescription;
        private String testCode;
        private Priority priority;
        private LocalDateTime createdAt;
        
        public TestSuggestionBuilder id(Long id) {
            this.id = id;
            return this;
        }
        
        public TestSuggestionBuilder analysis(CodeAnalysis analysis) {
            this.analysis = analysis;
            return this;
        }
        
        public TestSuggestionBuilder testType(TestType testType) {
            this.testType = testType;
            return this;
        }
        
        public TestSuggestionBuilder testDescription(String testDescription) {
            this.testDescription = testDescription;
            return this;
        }
        
        public TestSuggestionBuilder testCode(String testCode) {
            this.testCode = testCode;
            return this;
        }
        
        public TestSuggestionBuilder priority(Priority priority) {
            this.priority = priority;
            return this;
        }
        
        public TestSuggestionBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        
        public TestSuggestion build() {
            TestSuggestion testSuggestion = new TestSuggestion();
            testSuggestion.setId(this.id);
            testSuggestion.setAnalysis(this.analysis);
            testSuggestion.setTestType(this.testType);
            testSuggestion.setTestDescription(this.testDescription);
            testSuggestion.setTestCode(this.testCode);
            testSuggestion.setPriority(this.priority);
            testSuggestion.setCreatedAt(this.createdAt);
            return testSuggestion;
        }
    }
}
