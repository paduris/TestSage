package com.testsage.service;

import com.testsage.model.CodeAnalysis;
import com.testsage.model.RiskArea;
import com.testsage.repository.RiskAreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RiskAreaService {

    private final RiskAreaRepository riskAreaRepository;

    public List<RiskArea> getAllRiskAreas() {
        return riskAreaRepository.findAll();
    }

    public Optional<RiskArea> getRiskAreaById(Long id) {
        return riskAreaRepository.findById(id);
    }

    public List<RiskArea> getRiskAreasByAnalysis(CodeAnalysis analysis) {
        return riskAreaRepository.findByAnalysis(analysis);
    }

    public RiskArea createRiskArea(RiskArea riskArea) {
        return riskAreaRepository.save(riskArea);
    }

    public Optional<RiskArea> updateRiskArea(Long id, RiskArea riskAreaDetails) {
        return riskAreaRepository.findById(id)
                .map(riskArea -> {
                    riskArea.setFilePath(riskAreaDetails.getFilePath());
                    riskArea.setLineNumbers(riskAreaDetails.getLineNumbers());
                    riskArea.setRiskLevel(riskAreaDetails.getRiskLevel());
                    riskArea.setExplanation(riskAreaDetails.getExplanation());
                    return riskAreaRepository.save(riskArea);
                });
    }

    public void deleteRiskArea(Long id) {
        riskAreaRepository.deleteById(id);
    }
}
