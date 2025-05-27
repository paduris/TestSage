package com.testsage.controller;

import com.testsage.model.CodeAnalysis;
import com.testsage.model.TestSuggestion;
import com.testsage.service.CodeAnalysisService;
import com.testsage.service.TestSuggestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-suggestions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TestSuggestionController {

    private final TestSuggestionService testSuggestionService;
    private final CodeAnalysisService codeAnalysisService;

    @GetMapping
    public ResponseEntity<List<TestSuggestion>> getAllTestSuggestions() {
        return ResponseEntity.ok(testSuggestionService.getAllTestSuggestions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestSuggestion> getTestSuggestionById(@PathVariable Long id) {
        return testSuggestionService.getTestSuggestionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/analysis/{analysisId}")
    public ResponseEntity<List<TestSuggestion>> getTestSuggestionsByAnalysis(@PathVariable Long analysisId) {
        return codeAnalysisService.getAnalysisById(analysisId)
                .map(analysis -> ResponseEntity.ok(testSuggestionService.getTestSuggestionsByAnalysis(analysis)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TestSuggestion> createTestSuggestion(@RequestBody TestSuggestion testSuggestion) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(testSuggestionService.createTestSuggestion(testSuggestion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TestSuggestion> updateTestSuggestion(
            @PathVariable Long id,
            @RequestBody TestSuggestion testSuggestion) {
        
        return testSuggestionService.updateTestSuggestion(id, testSuggestion)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestSuggestion(@PathVariable Long id) {
        testSuggestionService.deleteTestSuggestion(id);
        return ResponseEntity.noContent().build();
    }
}
