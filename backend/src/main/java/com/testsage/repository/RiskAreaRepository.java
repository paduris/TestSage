package com.testsage.repository;

import com.testsage.model.CodeAnalysis;
import com.testsage.model.RiskArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RiskAreaRepository extends JpaRepository<RiskArea, Long> {
    List<RiskArea> findByAnalysis(CodeAnalysis analysis);
}
