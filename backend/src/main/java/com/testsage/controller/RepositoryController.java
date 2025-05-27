package com.testsage.controller;

import com.testsage.model.BusinessDomain;
import com.testsage.model.Repository;
import com.testsage.service.RepositoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repositories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RepositoryController {

    private final RepositoryService repositoryService;

    @GetMapping
    public ResponseEntity<List<Repository>> getAllRepositories() {
        return ResponseEntity.ok(repositoryService.getAllRepositories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Repository> getRepositoryById(@PathVariable Long id) {
        return repositoryService.getRepositoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Repository> createRepository(@RequestBody Repository repository) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(repositoryService.createRepository(repository));
    }

    @PostMapping("/quick")
    public ResponseEntity<Repository> quickCreateRepository(
            @RequestParam String name,
            @RequestParam String gitUrl,
            @RequestParam String branch,
            @RequestParam BusinessDomain businessDomain) {
        
        Repository repository = repositoryService.createRepository(name, gitUrl, branch, businessDomain);
        return ResponseEntity.status(HttpStatus.CREATED).body(repository);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Repository> updateRepository(
            @PathVariable Long id,
            @RequestBody Repository repository) {
        
        return repositoryService.updateRepository(id, repository)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRepository(@PathVariable Long id) {
        repositoryService.deleteRepository(id);
        return ResponseEntity.noContent().build();
    }
}
