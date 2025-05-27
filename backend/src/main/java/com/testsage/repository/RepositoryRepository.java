package com.testsage.repository;

import com.testsage.model.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@org.springframework.stereotype.Repository
public interface RepositoryRepository extends JpaRepository<com.testsage.model.Repository, Long> {
    java.util.Optional<com.testsage.model.Repository> findByName(String name);
    java.util.Optional<com.testsage.model.Repository> findByGitUrl(String gitUrl);
}
