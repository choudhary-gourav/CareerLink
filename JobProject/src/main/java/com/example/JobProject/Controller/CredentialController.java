package com.example.JobProject.Controller;

import com.example.JobProject.Model.Credential;
import com.example.JobProject.Repository.CredentialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class CredentialController {

    private final CredentialRepository credentialRepository;

    @PostMapping({"/api/submit", "/credential/submit"})
    public Credential submitCredential(@RequestBody Credential credential) {
        String email = getSubmittedEmail(credential);
        if (email != null) {
            credential.setEmail(email);
        }
        return credentialRepository.save(credential);
    }

    @PostMapping({"/api/login", "/credential/login"})
    public ResponseEntity<Map<String, Object>> login(@RequestBody Credential credential) {
        try {
            String rawUri = System.getenv("MONGODB_URI");
            System.out.println("=== DEBUG MONGODB_URI ===");
            System.out.println("MONGODB_URI: " + (rawUri != null ? rawUri.replaceAll("(?<=:)[^@:]+(?=@)", "*****") : "null"));
            System.out.println("=========================");
            
            String email = getSubmittedEmail(credential);
            String password = credential.getPassword();

            if (email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Email and password are required"
                ));
            }

            Optional<Credential> matchedCredentialOpt = findMatchingCredential(email, password);

            if (matchedCredentialOpt.isPresent()) {
                Credential savedCredential = matchedCredentialOpt.get();
                
                // Map.of throws NullPointerException if any value is null.
                // We use HashMap to safely handle potential null values (e.g. if name is null in DB).
                Map<String, Object> userMap = new java.util.HashMap<>();
                userMap.put("id", savedCredential.getId());
                userMap.put("name", savedCredential.getName());
                userMap.put("email", savedCredential.getEmail());
                userMap.put("role", savedCredential.getRole() != null ? savedCredential.getRole() : "CANDIDATE");

                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Login successful",
                        "user", userMap
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "success", false,
                        "message", "Invalid email or password"
                ));
            }
        } catch (Exception e) {
            e.printStackTrace(); // Logs the full error in Render logs
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Internal Server Error: " + e.getMessage()
            ));
        }
    }

    private String getSubmittedEmail(Credential credential) {
        if (credential.getEmail() != null && !credential.getEmail().isBlank()) {
            return credential.getEmail().trim();
        }

        if (credential.getWorkEmail() != null && !credential.getWorkEmail().isBlank()) {
            return credential.getWorkEmail().trim();
        }

        return null;
    }

    private Optional<Credential> findMatchingCredential(String email, String password) {
        List<Credential> credentials = credentialRepository.findAllByEmailIgnoreCase(email);

        if (credentials.isEmpty()) {
            credentials = credentialRepository.findAllByWorkEmailIgnoreCase(email);
        }

        return credentials.stream()
                .filter(savedCredential -> password.equals(savedCredential.getPassword()))
                .findFirst();
    }
}
