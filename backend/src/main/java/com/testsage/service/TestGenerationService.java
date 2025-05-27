package com.testsage.service;

import com.testsage.model.*;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestGenerationService {


    private final OpenAiService openAiService;
    private final GitService gitService;
    private final TestSuggestionService testSuggestionService;

    /**
     * Generates test suggestions for a code analysis
     */
    @Transactional
    public List<TestSuggestion> generateTestSuggestions(CodeAnalysis analysis) {
        Repository repository = analysis.getRepository();
        List<RiskArea> riskAreas = analysis.getRiskAreas();
        List<TestSuggestion> testSuggestions = new ArrayList<>();
        
        // For each risk area, generate test suggestions
        for (RiskArea riskArea : riskAreas) {
            String filePath = riskArea.getFilePath();
            String fileContent = gitService.getFileContent(repository, filePath);
            
            if (fileContent.isEmpty()) {
                continue;
            }
            
            // Use AI to generate test suggestions
            List<Map<String, Object>> aiTestSuggestions = generateTestsWithAI(
                    filePath, 
                    fileContent, 
                    riskArea.getLineNumbers(), 
                    riskArea.getExplanation());
            
            for (Map<String, Object> aiTestSuggestion : aiTestSuggestions) {
                TestSuggestion testSuggestion = TestSuggestion.builder()
                        .analysis(analysis)
                        .testType(TestType.valueOf((String) aiTestSuggestion.get("testType")))
                        .testDescription((String) aiTestSuggestion.get("testDescription"))
                        .testCode((String) aiTestSuggestion.get("testCode"))
                        .priority(mapRiskLevelToPriority(riskArea.getRiskLevel()))
                        .build();
                
                testSuggestions.add(testSuggestionService.createTestSuggestion(testSuggestion));
            }
        }
        
        return testSuggestions;
    }
    
    /**
     * Maps a risk level to a priority
     */
    private Priority mapRiskLevelToPriority(RiskLevel riskLevel) {
        return switch (riskLevel) {
            case LOW -> Priority.LOW;
            case MEDIUM -> Priority.MEDIUM;
            case HIGH -> Priority.HIGH;
            case CRITICAL -> Priority.CRITICAL;
        };
    }
    
    /**
     * Uses OpenAI to generate test suggestions
     */
    private List<Map<String, Object>> generateTestsWithAI(
            String filePath, 
            String fileContent, 
            String lineNumbers, 
            String riskExplanation) {
        
        List<Map<String, Object>> testSuggestions = new ArrayList<>();
        
        try {
            log.info("=== Starting AI Test Generation ====");
            log.info("Target File: {}", filePath);
            log.info("Target Lines: {}", lineNumbers);
            log.info("File Size: {} bytes", fileContent.length());
            log.info("Risk Explanation: {}", riskExplanation);
            log.info("Analysis Type: Test Generation");
            log.info("Model: gpt-4");
            
            String promptText = String.format("""
                    You are a test generation expert specializing in creating effective tests for high-risk code areas.
                    
                    Generate tests for the following code file:
                    
                    File: %s
                    
                    ```
                    %s
                    ```
                    
                    Risk Area: Lines %s
                    Risk Explanation: %s
                    
                    Generate up to 3 test suggestions. For each test suggestion, provide:
                    1. Test Type (UNIT, INTEGRATION, E2E)
                    2. Test Description (what the test verifies)
                    3. Test Code (actual test implementation)
                    
                    Format your response as a JSON array with objects containing "testType", "testDescription", and "testCode" fields.
                    Example:
                    [
                      {
                        "testType": "UNIT",
                        "testDescription": "Verifies that the method handles null input correctly",
                        "testCode": "@Test\npublic void testNullInput() {...}"
                      }
                    ]
                    """, filePath, fileContent, lineNumbers, riskExplanation);
            
            log.info("=== LLM Request Details ====");
            log.info("Prompt Length: {} characters", promptText.length());
            log.info("Generated Prompt:\n{}", promptText);
            
            long startTime = System.currentTimeMillis();
            
            ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()
                    .model("gpt-4")
                    .messages(List.of(new ChatMessage("user", promptText)))
                    .temperature(0.3)
                    .maxTokens(2000)
                    .build();
            
            log.info("Sending request to OpenAI API...");
            log.info("Request Configuration:");
            log.info("- Model: {}", chatCompletionRequest.getModel());
            log.info("- Temperature: {}", chatCompletionRequest.getTemperature());
            log.info("- Max Tokens: {}", chatCompletionRequest.getMaxTokens());
            
            String content = openAiService.createChatCompletion(chatCompletionRequest)
                    .getChoices().get(0).getMessage().getContent();
                    
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;
            
            log.info("=== LLM Response Details ====");
            log.info("Response Time: {} ms", duration);
            log.info("Response Length: {} characters", content.length());
            log.info("Response Content:\n{}", content);
                
            // Extract JSON array from the response
            Pattern pattern = Pattern.compile("\\[\\s*\\{.*?\\}\\s*\\]", Pattern.DOTALL);
            Matcher matcher = pattern.matcher(content);
            
            if (matcher.find()) {
                String jsonStr = matcher.group(0);
                // Parse the JSON string into a list of maps
                testSuggestions = parseJsonTestSuggestions(jsonStr);
            }
        } catch (Exception e) {
            log.error("Error generating tests with AI", e);
        }
        
        return testSuggestions;
    }
    
    /**
     * Simple JSON parser for test suggestions
     * In a real implementation, use a proper JSON library like Jackson
     */
    private List<Map<String, Object>> parseJsonTestSuggestions(String jsonStr) {
        List<Map<String, Object>> result = new ArrayList<>();
        
        // This is a very simplified parser - in a real implementation use Jackson
        // For the hackathon, we'll assume the AI returns well-formatted JSON
        
        // Extract objects between { }
        Pattern objectPattern = Pattern.compile("\\{(.*?)\\}", Pattern.DOTALL);
        Matcher objectMatcher = objectPattern.matcher(jsonStr);
        
        while (objectMatcher.find()) {
            String objectStr = objectMatcher.group(1);
            Map<String, Object> testSuggestion = new HashMap<>();
            
            // Extract testType
            Pattern testTypePattern = Pattern.compile("\"testType\"\\s*:\\s*\"(.*?)\"");
            Matcher testTypeMatcher = testTypePattern.matcher(objectStr);
            if (testTypeMatcher.find()) {
                testSuggestion.put("testType", testTypeMatcher.group(1));
            }
            
            // Extract testDescription
            Pattern testDescriptionPattern = Pattern.compile("\"testDescription\"\\s*:\\s*\"(.*?)\"");
            Matcher testDescriptionMatcher = testDescriptionPattern.matcher(objectStr);
            if (testDescriptionMatcher.find()) {
                testSuggestion.put("testDescription", testDescriptionMatcher.group(1).replace("\\\"", "\""));
            }
            
            // Extract testCode
            Pattern testCodePattern = Pattern.compile("\"testCode\"\\s*:\\s*\"(.*?)\"");
            Matcher testCodeMatcher = testCodePattern.matcher(objectStr);
            if (testCodeMatcher.find()) {
                testSuggestion.put("testCode", testCodeMatcher.group(1).replace("\\\\n", "\n").replace("\\\"", "\""));
            }
            
            if (!testSuggestion.isEmpty()) {
                result.add(testSuggestion);
            }
        }
        
        return result;
    }
}
