package com.testsage.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "repositories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Repository {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "git_url", nullable = false)
    private String gitUrl;

    @Column(nullable = false)
    private String branch;

    @Column(name = "business_domain")
    @Enumerated(EnumType.STRING)
    private BusinessDomain businessDomain;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "last_analyzed_at")
    private LocalDateTime lastAnalyzedAt;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGitUrl() {
        return gitUrl;
    }

    public void setGitUrl(String gitUrl) {
        this.gitUrl = gitUrl;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public BusinessDomain getBusinessDomain() {
        return businessDomain;
    }

    public void setBusinessDomain(BusinessDomain businessDomain) {
        this.businessDomain = businessDomain;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastAnalyzedAt() {
        return lastAnalyzedAt;
    }

    public void setLastAnalyzedAt(LocalDateTime lastAnalyzedAt) {
        this.lastAnalyzedAt = lastAnalyzedAt;
    }

    // Static builder method to ensure the builder pattern works
    public static RepositoryBuilder builder() {
        return new RepositoryBuilder();
    }

    // Custom builder class to ensure the builder pattern works
    public static class RepositoryBuilder {
        private Long id;
        private String name;
        private String gitUrl;
        private String branch;
        private BusinessDomain businessDomain;
        private LocalDateTime createdAt;
        private LocalDateTime lastAnalyzedAt;

        public RepositoryBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public RepositoryBuilder name(String name) {
            this.name = name;
            return this;
        }

        public RepositoryBuilder gitUrl(String gitUrl) {
            this.gitUrl = gitUrl;
            return this;
        }

        public RepositoryBuilder branch(String branch) {
            this.branch = branch;
            return this;
        }

        public RepositoryBuilder businessDomain(BusinessDomain businessDomain) {
            this.businessDomain = businessDomain;
            return this;
        }

        public RepositoryBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public RepositoryBuilder lastAnalyzedAt(LocalDateTime lastAnalyzedAt) {
            this.lastAnalyzedAt = lastAnalyzedAt;
            return this;
        }

        public Repository build() {
            Repository repository = new Repository();
            repository.setId(this.id);
            repository.setName(this.name);
            repository.setGitUrl(this.gitUrl);
            repository.setBranch(this.branch);
            repository.setBusinessDomain(this.businessDomain);
            repository.setCreatedAt(this.createdAt);
            repository.setLastAnalyzedAt(this.lastAnalyzedAt);
            return repository;
        }
    }
}
