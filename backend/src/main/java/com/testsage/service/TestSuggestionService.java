package com.testsage.service;

import com.testsage.model.CodeAnalysis;
import com.testsage.model.TestSuggestion;
import com.testsage.repository.TestSuggestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TestSuggestionService {

    private final TestSuggestionRepository testSuggestionRepository;

    public List<TestSuggestion> getAllTestSuggestions() {
        return testSuggestionRepository.findAll();
    }

    public Optional<TestSuggestion> getTestSuggestionById(Long id) {
        return testSuggestionRepository.findById(id);
    }

    public List<TestSuggestion> getTestSuggestionsByAnalysis(CodeAnalysis analysis) {
        return testSuggestionRepository.findByAnalysisOrderByPriorityDesc(analysis);
    }

    public TestSuggestion createTestSuggestion(TestSuggestion testSuggestion) {
        return testSuggestionRepository.save(testSuggestion);
    }

    public Optional<TestSuggestion> updateTestSuggestion(Long id, TestSuggestion testSuggestionDetails) {
        return testSuggestionRepository.findById(id)
                .map(testSuggestion -> {
                    testSuggestion.setTestType(testSuggestionDetails.getTestType());
                    testSuggestion.setTestDescription(testSuggestionDetails.getTestDescription());
                    testSuggestion.setTestCode(testSuggestionDetails.getTestCode());
                    testSuggestion.setPriority(testSuggestionDetails.getPriority());
                    return testSuggestionRepository.save(testSuggestion);
                });
    }

    public void deleteTestSuggestion(Long id) {
        testSuggestionRepository.deleteById(id);
    }
}
