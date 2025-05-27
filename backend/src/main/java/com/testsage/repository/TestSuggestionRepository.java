package com.testsage.repository;

import com.testsage.model.CodeAnalysis;
import com.testsage.model.TestSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestSuggestionRepository extends JpaRepository<TestSuggestion, Long> {
    List<TestSuggestion> findByAnalysisOrderByPriorityDesc(CodeAnalysis analysis);
}
