package com.testsage.service;

import com.testsage.model.Repository;
import com.testsage.model.RiskAreaConfig;
import com.testsage.repository.RiskAreaConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RiskAreaConfigService {

    private final RiskAreaConfigRepository riskAreaConfigRepository;

    public List<RiskAreaConfig> getAllRiskAreaConfigs() {
        return riskAreaConfigRepository.findAll();
    }

    public Optional<RiskAreaConfig> getRiskAreaConfigById(Long id) {
        return riskAreaConfigRepository.findById(id);
    }

    public List<RiskAreaConfig> getActiveRiskAreaConfigsByRepository(Repository repository) {
        return riskAreaConfigRepository.findByRepositoryAndIsActiveTrue(repository);
    }

    public RiskAreaConfig createRiskAreaConfig(RiskAreaConfig riskAreaConfig) {
        return riskAreaConfigRepository.save(riskAreaConfig);
    }

    public Optional<RiskAreaConfig> updateRiskAreaConfig(Long id, RiskAreaConfig riskAreaConfigDetails) {
        return riskAreaConfigRepository.findById(id)
                .map(riskAreaConfig -> {
                    riskAreaConfig.setAreaPattern(riskAreaConfigDetails.getAreaPattern());
                    riskAreaConfig.setRiskWeight(riskAreaConfigDetails.getRiskWeight());
                    riskAreaConfig.setDescription(riskAreaConfigDetails.getDescription());
                    riskAreaConfig.setIsActive(riskAreaConfigDetails.getIsActive());
                    return riskAreaConfigRepository.save(riskAreaConfig);
                });
    }

    public void deleteRiskAreaConfig(Long id) {
        riskAreaConfigRepository.deleteById(id);
    }
}
