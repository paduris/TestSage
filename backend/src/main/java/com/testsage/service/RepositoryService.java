package com.testsage.service;

import com.testsage.model.BusinessDomain;
import com.testsage.model.Repository;
import com.testsage.repository.RepositoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RepositoryService {

    private final RepositoryRepository repositoryRepository;

    public List<Repository> getAllRepositories() {
        return repositoryRepository.findAll();
    }

    public Optional<Repository> getRepositoryById(Long id) {
        return repositoryRepository.findById(id);
    }

    public Repository createRepository(Repository repository) {
        return repositoryRepository.save(repository);
    }

    public Repository createRepository(String name, String gitUrl, String branch, BusinessDomain businessDomain) {
        Repository repository = Repository.builder()
                .name(name)
                .gitUrl(gitUrl)
                .branch(branch)
                .businessDomain(businessDomain)
                .createdAt(LocalDateTime.now())
                .build();
        return repositoryRepository.save(repository);
    }

    public Optional<Repository> updateRepository(Long id, Repository repositoryDetails) {
        return repositoryRepository.findById(id)
                .map(repository -> {
                    repository.setName(repositoryDetails.getName());
                    repository.setGitUrl(repositoryDetails.getGitUrl());
                    repository.setBranch(repositoryDetails.getBranch());
                    repository.setBusinessDomain(repositoryDetails.getBusinessDomain());
                    return repositoryRepository.save(repository);
                });
    }

    public void deleteRepository(Long id) {
        repositoryRepository.deleteById(id);
    }

    public void updateLastAnalyzedTime(Long id) {
        repositoryRepository.findById(id).ifPresent(repository -> {
            repository.setLastAnalyzedAt(LocalDateTime.now());
            repositoryRepository.save(repository);
        });
    }
}
