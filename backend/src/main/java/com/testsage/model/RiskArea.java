package com.testsage.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "risk_areas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RiskArea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "analysis_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonBackReference
    private CodeAnalysis analysis;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "line_numbers", nullable = false)
    private String lineNumbers;

    @Column(name = "risk_level", nullable = false)
    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;

    @Column(name = "explanation", columnDefinition = "TEXT")
    private String explanation;
    
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

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getLineNumbers() {
        return lineNumbers;
    }

    public void setLineNumbers(String lineNumbers) {
        this.lineNumbers = lineNumbers;
    }

    public RiskLevel getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(RiskLevel riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
    
    // Static builder method to ensure the builder pattern works
    public static RiskAreaBuilder builder() {
        return new RiskAreaBuilder();
    }
    
    // Custom builder class to ensure the builder pattern works
    public static class RiskAreaBuilder {
        private Long id;
        private CodeAnalysis analysis;
        private String filePath;
        private String lineNumbers;
        private RiskLevel riskLevel;
        private String explanation;
        
        public RiskAreaBuilder id(Long id) {
            this.id = id;
            return this;
        }
        
        public RiskAreaBuilder analysis(CodeAnalysis analysis) {
            this.analysis = analysis;
            return this;
        }
        
        public RiskAreaBuilder filePath(String filePath) {
            this.filePath = filePath;
            return this;
        }
        
        public RiskAreaBuilder lineNumbers(String lineNumbers) {
            this.lineNumbers = lineNumbers;
            return this;
        }
        
        public RiskAreaBuilder riskLevel(RiskLevel riskLevel) {
            this.riskLevel = riskLevel;
            return this;
        }
        
        public RiskAreaBuilder explanation(String explanation) {
            this.explanation = explanation;
            return this;
        }
        
        public RiskArea build() {
            RiskArea riskArea = new RiskArea();
            riskArea.setId(this.id);
            riskArea.setAnalysis(this.analysis);
            riskArea.setFilePath(this.filePath);
            riskArea.setLineNumbers(this.lineNumbers);
            riskArea.setRiskLevel(this.riskLevel);
            riskArea.setExplanation(this.explanation);
            return riskArea;
        }
    }
}
