package com.testsage.repository;

import com.testsage.model.Repository;
import com.testsage.model.RiskAreaConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@org.springframework.stereotype.Repository
public interface RiskAreaConfigRepository extends JpaRepository<RiskAreaConfig, Long> {
    List<RiskAreaConfig> findByRepositoryAndIsActiveTrue(Repository repository);
}
