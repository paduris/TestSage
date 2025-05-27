package com.testsage.service;

import com.testsage.model.Repository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class GitService {

    private static final String TEMP_DIR = System.getProperty("java.io.tmpdir");
    private static final String GIT_PATH = "git";
    
    /**
     * Gets the latest commit hash from a repository
     */
    public String getLatestCommitHash(Repository repository) {
        try {
            String repoPath = cloneOrPullRepository(repository);
            ProcessBuilder processBuilder = new ProcessBuilder(GIT_PATH, "rev-parse", "HEAD");
            processBuilder.directory(new File(repoPath));
            Process process = processBuilder.start();
            
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String commitHash = reader.readLine();
                process.waitFor(10, TimeUnit.SECONDS);
                return commitHash;
            }
        } catch (IOException | InterruptedException e) {
            log.error("Error getting latest commit hash", e);
            return "unknown";
        }
    }
    
    /**
     * Gets the diff content from the latest commit
     */
    public String getDiffContent(Repository repository) {
        try {
            String repoPath = cloneOrPullRepository(repository);
            ProcessBuilder processBuilder = new ProcessBuilder(GIT_PATH, "diff", "HEAD~1", "HEAD");
            processBuilder.directory(new File(repoPath));
            Process process = processBuilder.start();
            
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
                process.waitFor(30, TimeUnit.SECONDS);
                return output.toString();
            }
        } catch (IOException | InterruptedException e) {
            log.error("Error getting diff content", e);
            return "";
        }
    }
    
    /**
     * Gets the number of files changed in the latest commit
     */
    public int getFilesChanged(Repository repository) {
        try {
            String repoPath = cloneOrPullRepository(repository);
            ProcessBuilder processBuilder = new ProcessBuilder(GIT_PATH, "diff", "--name-only", "HEAD~1", "HEAD");
            processBuilder.directory(new File(repoPath));
            Process process = processBuilder.start();
            
            List<String> changedFiles = new ArrayList<>();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    changedFiles.add(line);
                }
                process.waitFor(10, TimeUnit.SECONDS);
                return changedFiles.size();
            }
        } catch (IOException | InterruptedException e) {
            log.error("Error getting files changed", e);
            return 0;
        }
    }
    
    /**
     * Gets a list of changed files in the latest commit
     */
    public List<String> getChangedFiles(Repository repository) {
        try {
            String repoPath = cloneOrPullRepository(repository);
            ProcessBuilder processBuilder = new ProcessBuilder(GIT_PATH, "diff", "--name-only", "HEAD~1", "HEAD");
            processBuilder.directory(new File(repoPath));
            Process process = processBuilder.start();
            
            List<String> changedFiles = new ArrayList<>();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    changedFiles.add(line);
                }
                process.waitFor(10, TimeUnit.SECONDS);
                return changedFiles;
            }
        } catch (IOException | InterruptedException e) {
            log.error("Error getting changed files", e);
            return new ArrayList<>();
        }
    }
    
    /**
     * Gets the content of a specific file at the latest commit
     */
    public String getFileContent(Repository repository, String filePath) {
        try {
            String repoPath = cloneOrPullRepository(repository);
            Path fullPath = Paths.get(repoPath, filePath);
            if (Files.exists(fullPath)) {
                return Files.readString(fullPath);
            }
            return "";
        } catch (IOException | InterruptedException e) {
            log.error("Error getting file content", e);
            return "";
        }
    }
    
    /**
     * Clones a repository if it doesn't exist, or pulls the latest changes if it does
     */
    private String cloneOrPullRepository(Repository repository) throws IOException, InterruptedException {
        String repoName = repository.getName();
        String repoDir = TEMP_DIR + File.separator + "testsage" + File.separator + repoName;
        File repoDirFile = new File(repoDir);
        
        if (repoDirFile.exists()) {
            // Repository already exists, pull latest changes
            ProcessBuilder processBuilder = new ProcessBuilder(GIT_PATH, "pull");
            processBuilder.directory(repoDirFile);
            Process process = processBuilder.start();
            process.waitFor(30, TimeUnit.SECONDS);
        } else {
            // Repository doesn't exist, clone it
            Files.createDirectories(Paths.get(TEMP_DIR, "testsage"));
            ProcessBuilder processBuilder = new ProcessBuilder(
                    GIT_PATH, "clone", repository.getGitUrl(), "-b", repository.getBranch(), repoDir);
            Process process = processBuilder.start();
            process.waitFor(60, TimeUnit.SECONDS);
        }
        
        return repoDir;
    }
}
