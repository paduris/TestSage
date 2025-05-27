package com.testsage.service;

import com.testsage.model.*;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class RiskCalculationService {

    private static final Logger log = LoggerFactory.getLogger(RiskCalculationService.class);
    
    private final OpenAiService openAiService;
    private final GitService gitService;
    private final RiskAreaConfigService riskAreaConfigService;

    /**
     * Calculates the risk score for a code analysis
     */
    public Double calculateRiskScore(CodeAnalysis analysis) {
        Repository repository = analysis.getRepository();
        List<RiskAreaConfig> riskConfigs = riskAreaConfigService.getActiveRiskAreaConfigsByRepository(repository);
        
        // Get the list of changed files
        List<String> changedFiles = gitService.getChangedFiles(repository);
        if (changedFiles.isEmpty()) {
            return 0.0;
        }
        
        double totalRiskScore = 0.0;
        double maxPossibleScore = changedFiles.size() * 10.0; // Maximum score if all files are high risk
        
        // Calculate base risk score based on file patterns
        for (String file : changedFiles) {
            double fileRiskScore = 1.0; // Default risk score
            
            // Apply risk weights from configurations
            for (RiskAreaConfig config : riskConfigs) {
                if (file.matches(config.getAreaPattern())) {
                    fileRiskScore *= config.getRiskWeight();
                }
            }
            
            totalRiskScore += fileRiskScore;
        }
        
        // Normalize the risk score to a scale of 0-100
        return (totalRiskScore / maxPossibleScore) * 100.0;
    }
    
    /**
     * Identifies risk areas in the code changes
     */
    public List<RiskArea> identifyRiskAreas(CodeAnalysis analysis) {
        Repository repository = analysis.getRepository();
        List<String> changedFiles = gitService.getChangedFiles(repository);
        List<RiskArea> riskAreas = new ArrayList<>();
        
        for (String file : changedFiles) {
            // Skip non-code files
            if (!isCodeFile(file)) {
                continue;
            }
            
            String fileContent = gitService.getFileContent(repository, file);
            if (fileContent.isEmpty()) {
                continue;
            }
            
            // Use AI to analyze the code and identify risk areas
            List<Map<String, Object>> aiRiskAreas = analyzeCodeWithAI(file, fileContent);
            
            for (Map<String, Object> aiRiskArea : aiRiskAreas) {
                // Use the builder pattern to create RiskArea objects
                RiskArea riskArea = RiskArea.builder()
                        .analysis(analysis)
                        .filePath(file)
                        .lineNumbers((String) aiRiskArea.get("lineNumbers"))
                        .riskLevel(RiskLevel.valueOf((String) aiRiskArea.get("riskLevel")))
                        .explanation((String) aiRiskArea.get("explanation"))
                        .build();
                
                riskAreas.add(riskArea);
            }
        }
        
        return riskAreas;
    }
    
    /**
     * Checks if a file is a code file based on its extension
     */
    private boolean isCodeFile(String filePath) {
        String[] codeExtensions = {
                ".java", ".py", ".js", ".ts", ".jsx", ".tsx", ".c", ".cpp", ".h", ".cs", 
                ".go", ".rb", ".php", ".scala", ".kt", ".swift", ".rs", ".m", ".sql"
        };
        
        for (String ext : codeExtensions) {
            if (filePath.endsWith(ext)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Uses OpenAI to analyze code and identify risk areas
     */
    private List<Map<String, Object>> analyzeCodeWithAI(String filePath, String fileContent) {
        List<Map<String, Object>> riskAreas = new ArrayList<>();
        
        try {
            String promptText = String.format("""
                    You are a code analysis expert specializing in identifying potential risks in code changes.
                    
                    Analyze the following code file and identify areas that might need testing:
                    
                    File: %s
                    
                    ```
                    %s
                    ```
                    
                    Identify up to 3 specific areas in the code that have the highest risk and would benefit from testing.
                    For each area, provide:
                    1. The line numbers (e.g., "10-15" or "42")
                    2. A risk level (LOW, MEDIUM, HIGH, or CRITICAL)
                    3. A brief explanation of why this area is risky and what kind of tests would be appropriate
                    
                    Format your response as a JSON array with objects containing "lineNumbers", "riskLevel", and "explanation" fields.
                    Example:
                    [
                      {
                        "lineNumbers": "15-20",
                        "riskLevel": "HIGH",
                        "explanation": "This method handles financial transactions without proper validation."
                      }
                    ]
                    """, filePath, fileContent);
            
            ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()
                    .model("gpt-3.5-turbo")
                    .messages(List.of(new ChatMessage("user", promptText)))
                    .temperature(0.3)
                    .maxTokens(2000)
                    .build();
            
            String content = openAiService.createChatCompletion(chatCompletionRequest)
                    .getChoices().get(0).getMessage().getContent();
            
            // Extract JSON array from the response
            Pattern pattern = Pattern.compile("\\[\\s*\\{.*?\\}\\s*\\]", Pattern.DOTALL);
            Matcher matcher = pattern.matcher(content);
            
            if (matcher.find()) {
                String jsonStr = matcher.group(0);
                // Parse the JSON string into a list of maps
                // This is a simplified version - in a real implementation, use a proper JSON parser
                riskAreas = parseJsonRiskAreas(jsonStr);
            }
        } catch (Exception e) {
            log.error("Error analyzing code with AI", e);
        }
        
        return riskAreas;
    }
    
    /**
     * Simple JSON parser for risk areas
     * In a real implementation, use a proper JSON library like Jackson
     */
    private List<Map<String, Object>> parseJsonRiskAreas(String jsonStr) {
        List<Map<String, Object>> result = new ArrayList<>();
        
        // This is a very simplified parser - in a real implementation use Jackson
        // For the hackathon, we'll assume the AI returns well-formatted JSON
        
        // Extract objects between { }
        Pattern objectPattern = Pattern.compile("\\{(.*?)\\}", Pattern.DOTALL);
        Matcher objectMatcher = objectPattern.matcher(jsonStr);
        
        while (objectMatcher.find()) {
            String objectStr = objectMatcher.group(1);
            Map<String, Object> riskArea = new HashMap<>();
            
            // Extract lineNumbers
            Pattern lineNumbersPattern = Pattern.compile("\"lineNumbers\"\\s*:\\s*\"(.*?)\"");
            Matcher lineNumbersMatcher = lineNumbersPattern.matcher(objectStr);
            if (lineNumbersMatcher.find()) {
                riskArea.put("lineNumbers", lineNumbersMatcher.group(1));
            }
            
            // Extract riskLevel
            Pattern riskLevelPattern = Pattern.compile("\"riskLevel\"\\s*:\\s*\"(.*?)\"");
            Matcher riskLevelMatcher = riskLevelPattern.matcher(objectStr);
            if (riskLevelMatcher.find()) {
                riskArea.put("riskLevel", riskLevelMatcher.group(1));
            }
            
            // Extract explanation
            Pattern explanationPattern = Pattern.compile("\"explanation\"\\s*:\\s*\"(.*?)\"");
            Matcher explanationMatcher = explanationPattern.matcher(objectStr);
            if (explanationMatcher.find()) {
                riskArea.put("explanation", explanationMatcher.group(1).replace("\\\"", "\""));
            }
            
            if (!riskArea.isEmpty()) {
                result.add(riskArea);
            }
        }
        
        return result;
    }
}
