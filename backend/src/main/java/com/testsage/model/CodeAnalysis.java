package com.testsage.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "code_analyses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CodeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "repository_id", nullable = false)
    private Repository repository;

    @Column(name = "commit_hash", nullable = false)
    private String commitHash;

    @Column(name = "analysis_date", nullable = false)
    private LocalDateTime analysisDate;

    @Column(name = "risk_score")
    private Double riskScore;

    @Column(name = "diff_content", columnDefinition = "TEXT")
    private String diffContent;

    @Column(name = "files_changed")
    private Integer filesChanged;
    
    @OneToMany(mappedBy = "analysis", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private List<RiskArea> riskAreas = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        analysisDate = LocalDateTime.now();
    }
    
    // Explicit getters and setters to ensure they're available
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Repository getRepository() {
        return repository;
    }

    public void setRepository(Repository repository) {
        this.repository = repository;
    }

    public String getCommitHash() {
        return commitHash;
    }

    public void setCommitHash(String commitHash) {
        this.commitHash = commitHash;
    }

    public LocalDateTime getAnalysisDate() {
        return analysisDate;
    }

    public void setAnalysisDate(LocalDateTime analysisDate) {
        this.analysisDate = analysisDate;
    }

    public Double getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Double riskScore) {
        this.riskScore = riskScore;
    }

    public String getDiffContent() {
        return diffContent;
    }

    public void setDiffContent(String diffContent) {
        this.diffContent = diffContent;
    }

    public Integer getFilesChanged() {
        return filesChanged;
    }

    public void setFilesChanged(Integer filesChanged) {
        this.filesChanged = filesChanged;
    }
    
    public List<RiskArea> getRiskAreas() {
        return riskAreas;
    }
    
    public void setRiskAreas(List<RiskArea> riskAreas) {
        this.riskAreas = riskAreas;
    }
    
    // Static builder method to ensure the builder pattern works
    public static CodeAnalysisBuilder builder() {
        return new CodeAnalysisBuilder();
    }
    
    // Custom builder class to ensure the builder pattern works
    public static class CodeAnalysisBuilder {
        private Long id;
        private Repository repository;
        private String commitHash;
        private LocalDateTime analysisDate;
        private Double riskScore;
        private String diffContent;
        private Integer filesChanged;
        private List<RiskArea> riskAreas = new ArrayList<>();
        
        public CodeAnalysisBuilder id(Long id) {
            this.id = id;
            return this;
        }
        
        public CodeAnalysisBuilder repository(Repository repository) {
            this.repository = repository;
            return this;
        }
        
        public CodeAnalysisBuilder commitHash(String commitHash) {
            this.commitHash = commitHash;
            return this;
        }
        
        public CodeAnalysisBuilder analysisDate(LocalDateTime analysisDate) {
            this.analysisDate = analysisDate;
            return this;
        }
        
        public CodeAnalysisBuilder riskScore(Double riskScore) {
            this.riskScore = riskScore;
            return this;
        }
        
        public CodeAnalysisBuilder diffContent(String diffContent) {
            this.diffContent = diffContent;
            return this;
        }
        
        public CodeAnalysisBuilder filesChanged(Integer filesChanged) {
            this.filesChanged = filesChanged;
            return this;
        }
        
        public CodeAnalysisBuilder riskAreas(List<RiskArea> riskAreas) {
            this.riskAreas = riskAreas;
            return this;
        }
        
        public CodeAnalysis build() {
            CodeAnalysis codeAnalysis = new CodeAnalysis();
            codeAnalysis.setId(this.id);
            codeAnalysis.setRepository(this.repository);
            codeAnalysis.setCommitHash(this.commitHash);
            codeAnalysis.setAnalysisDate(this.analysisDate);
            codeAnalysis.setRiskScore(this.riskScore);
            codeAnalysis.setDiffContent(this.diffContent);
            codeAnalysis.setFilesChanged(this.filesChanged);
            codeAnalysis.setRiskAreas(this.riskAreas);
            return codeAnalysis;
        }
    }
}
