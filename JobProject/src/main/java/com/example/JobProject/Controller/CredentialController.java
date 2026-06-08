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

    @PostMapping("/api/google-login")
    public ResponseEntity<Map<String, Object>> googleLogin(@RequestBody Map<String, String> request) {
        try {
            String idToken = request.get("idToken");
            if (idToken == null || idToken.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "ID token is required"
                ));
            }

            // Verify the token by calling Google's tokeninfo API
            String verifyUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            
            Map<String, Object> tokenInfo;
            try {
                tokenInfo = restTemplate.getForObject(verifyUrl, Map.class);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "success", false,
                        "message", "Invalid Google ID token: Verification failed"
                ));
            }

            if (tokenInfo == null || tokenInfo.containsKey("error") || tokenInfo.containsKey("error_description")) {
                String errMsg = tokenInfo != null && tokenInfo.get("error_description") != null 
                        ? (String) tokenInfo.get("error_description") 
                        : "Invalid token";
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "success", false,
                        "message", "Google verification failed: " + errMsg
                ));
            }

            String email = (String) tokenInfo.get("email");
            String name = (String) tokenInfo.get("name");
            String aud = (String) tokenInfo.get("aud");

            if (email == null || email.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                        "success", false,
                        "message", "Email not found in Google ID Token"
                ));
            }

            // Validate Audience if client ID is configured
            String envClientId = System.getenv("GOOGLE_CLIENT_ID");
            if (envClientId != null && !envClientId.isBlank() && !envClientId.equals("your-google-client-id-here.apps.googleusercontent.com")) {
                if (!envClientId.equals(aud)) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                            "success", false,
                            "message", "Invalid token audience. Client ID mismatch."
                    ));
                }
            }

            // Find or create credential
            List<Credential> credentials = credentialRepository.findAllByEmailIgnoreCase(email);
            if (credentials.isEmpty()) {
                credentials = credentialRepository.findAllByWorkEmailIgnoreCase(email);
            }

            Credential userCredential;
            if (credentials.isEmpty()) {
                // Register new user from Google profile
                userCredential = new Credential();
                userCredential.setEmail(email.trim());
                userCredential.setName(name != null ? name.trim() : email.split("@")[0]);
                userCredential.setRole("CANDIDATE");
                userCredential.setPassword(""); // No password needed for Google SSO
                userCredential = credentialRepository.save(userCredential);
            } else {
                userCredential = credentials.get(0);
            }

            Map<String, Object> userMap = new java.util.HashMap<>();
            userMap.put("id", userCredential.getId());
            userMap.put("name", userCredential.getName());
            userMap.put("email", userCredential.getEmail());
            userMap.put("role", userCredential.getRole() != null ? userCredential.getRole() : "CANDIDATE");

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Login successful",
                    "user", userMap
            ));
        } catch (Exception e) {
            e.printStackTrace();
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
