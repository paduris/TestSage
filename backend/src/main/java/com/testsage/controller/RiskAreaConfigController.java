package com.testsage.controller;

import com.testsage.model.Repository;
import com.testsage.model.RiskAreaConfig;
import com.testsage.service.RepositoryService;
import com.testsage.service.RiskAreaConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/risk-configs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RiskAreaConfigController {

    private final RiskAreaConfigService riskAreaConfigService;
    private final RepositoryService repositoryService;

    @GetMapping
    public ResponseEntity<List<RiskAreaConfig>> getAllRiskAreaConfigs() {
        return ResponseEntity.ok(riskAreaConfigService.getAllRiskAreaConfigs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RiskAreaConfig> getRiskAreaConfigById(@PathVariable Long id) {
        return riskAreaConfigService.getRiskAreaConfigById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/repository/{repositoryId}")
    public ResponseEntity<List<RiskAreaConfig>> getActiveRiskAreaConfigsByRepository(@PathVariable Long repositoryId) {
        return repositoryService.getRepositoryById(repositoryId)
                .map(repository -> ResponseEntity.ok(riskAreaConfigService.getActiveRiskAreaConfigsByRepository(repository)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<RiskAreaConfig> createRiskAreaConfig(@RequestBody RiskAreaConfig riskAreaConfig) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(riskAreaConfigService.createRiskAreaConfig(riskAreaConfig));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RiskAreaConfig> updateRiskAreaConfig(
            @PathVariable Long id,
            @RequestBody RiskAreaConfig riskAreaConfig) {
        
        return riskAreaConfigService.updateRiskAreaConfig(id, riskAreaConfig)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRiskAreaConfig(@PathVariable Long id) {
        riskAreaConfigService.deleteRiskAreaConfig(id);
        return ResponseEntity.noContent().build();
    }
}
