package com.testsage.service;

import com.testsage.model.CodeAnalysis;
import com.testsage.model.Repository;
import com.testsage.model.RiskArea;
import com.testsage.repository.CodeAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CodeAnalysisService {

    private final CodeAnalysisRepository codeAnalysisRepository;
    private final RepositoryService repositoryService;
    private final RiskAreaService riskAreaService;
    private final GitService gitService;
    private final RiskCalculationService riskCalculationService;

    public List<CodeAnalysis> getAllAnalyses() {
        return codeAnalysisRepository.findAll();
    }

    public Optional<CodeAnalysis> getAnalysisById(Long id) {
        return codeAnalysisRepository.findById(id);
    }

    public List<CodeAnalysis> getAnalysesByRepository(Repository repository) {
        return codeAnalysisRepository.findByRepositoryOrderByAnalysisDateDesc(repository);
    }

    @Transactional
    public CodeAnalysis createAnalysis(Repository repository, String commitHash, String diffContent, int filesChanged) {
        // Check if analysis already exists for this commit
        Optional<CodeAnalysis> existingAnalysis = codeAnalysisRepository.findByRepositoryAndCommitHash(repository, commitHash);
        if (existingAnalysis.isPresent()) {
            return existingAnalysis.get();
        }
        CodeAnalysis analysis = CodeAnalysis.builder()
                .repository(repository)
                .commitHash(commitHash)
                .analysisDate(LocalDateTime.now())
                .diffContent(diffContent)
                .filesChanged(filesChanged)
                .build();
        
        CodeAnalysis savedAnalysis = codeAnalysisRepository.save(analysis);
        
        // Update the last analyzed time for the repository
        repositoryService.updateLastAnalyzedTime(repository.getId());
        
        return savedAnalysis;
    }

    @Transactional
    public CodeAnalysis analyzeRepository(Long repositoryId) {
        Repository repository = repositoryService.getRepositoryById(repositoryId)
                .orElseThrow(() -> new IllegalArgumentException("Repository not found with id: " + repositoryId));

        // Get the latest commit and diff from Git
        String commitHash = gitService.getLatestCommitHash(repository);
        String diffContent = gitService.getDiffContent(repository);
        int filesChanged = gitService.getFilesChanged(repository);

        // Create the analysis
        CodeAnalysis analysis = createAnalysis(repository, commitHash, diffContent, filesChanged);

        // Calculate risk score and identify risk areas
        Double riskScore = riskCalculationService.calculateRiskScore(analysis);
        analysis.setRiskScore(riskScore);
        codeAnalysisRepository.save(analysis);

        // Identify and save risk areas
        List<RiskArea> riskAreas = riskCalculationService.identifyRiskAreas(analysis);
        riskAreas.forEach(riskArea -> riskAreaService.createRiskArea(riskArea));

        return analysis;
    }

    public void deleteAnalysis(Long id) {
        codeAnalysisRepository.deleteById(id);
    }
}
