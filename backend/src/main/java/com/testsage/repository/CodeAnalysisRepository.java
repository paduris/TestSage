package com.testsage.repository;

import com.testsage.model.CodeAnalysis;
import com.testsage.model.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Repository
public interface CodeAnalysisRepository extends JpaRepository<CodeAnalysis, Long> {
    List<CodeAnalysis> findByRepositoryOrderByAnalysisDateDesc(Repository repository);
    Optional<CodeAnalysis> findByRepositoryAndCommitHash(Repository repository, String commitHash);
}
