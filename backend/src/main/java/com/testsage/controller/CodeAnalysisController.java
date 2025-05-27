package com.testsage.controller;

import com.testsage.model.CodeAnalysis;
import com.testsage.model.Repository;
import com.testsage.model.RiskArea;
import com.testsage.model.TestSuggestion;
import com.testsage.service.CodeAnalysisService;
import com.testsage.service.RepositoryService;
import com.testsage.service.RiskAreaService;
import com.testsage.service.TestGenerationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analyses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CodeAnalysisController {

    private final CodeAnalysisService codeAnalysisService;
    private final RepositoryService repositoryService;
    private final RiskAreaService riskAreaService;
    private final TestGenerationService testGenerationService;

    @GetMapping
    public ResponseEntity<List<CodeAnalysis>> getAllAnalyses() {
        return ResponseEntity.ok(codeAnalysisService.getAllAnalyses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CodeAnalysis> getAnalysisById(@PathVariable Long id) {
        return codeAnalysisService.getAnalysisById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/repository/{repositoryId}")
    public ResponseEntity<List<CodeAnalysis>> getAnalysesByRepository(@PathVariable Long repositoryId) {
        return repositoryService.getRepositoryById(repositoryId)
                .map(repository -> ResponseEntity.ok(codeAnalysisService.getAnalysesByRepository(repository)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/repository/{repositoryId}")
    public ResponseEntity<CodeAnalysis> analyzeRepository(@PathVariable Long repositoryId) {
        try {
            CodeAnalysis analysis = codeAnalysisService.analyzeRepository(repositoryId);
            return ResponseEntity.status(HttpStatus.CREATED).body(analysis);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{analysisId}/risk-areas")
    public ResponseEntity<List<RiskArea>> getRiskAreasByAnalysis(@PathVariable Long analysisId) {
        return codeAnalysisService.getAnalysisById(analysisId)
                .map(analysis -> ResponseEntity.ok(riskAreaService.getRiskAreasByAnalysis(analysis)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{analysisId}/generate-tests")
    public ResponseEntity<List<TestSuggestion>> generateTests(@PathVariable Long analysisId) {
        return codeAnalysisService.getAnalysisById(analysisId)
                .map(analysis -> ResponseEntity.ok(testGenerationService.generateTestSuggestions(analysis)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnalysis(@PathVariable Long id) {
        codeAnalysisService.deleteAnalysis(id);
        return ResponseEntity.noContent().build();
    }
}
