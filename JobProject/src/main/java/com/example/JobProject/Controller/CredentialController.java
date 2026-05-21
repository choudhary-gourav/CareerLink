package com.example.JobProject.Controller;

import com.example.JobProject.Model.Credential;
import com.example.JobProject.Repository.CredentialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins ="http:
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
        String email = getSubmittedEmail(credential);
        String password = credential.getPassword();

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Email and password are required"
            ));
        }

        return findMatchingCredential(email, password)
                .filter(savedCredential -> password.equals(savedCredential.getPassword()))
                .map(savedCredential -> ResponseEntity.ok(Map.<String, Object>of(
                        "success", true,
                        "message", "Login successful",
                        "user", Map.of(
                                "id", savedCredential.getId(),
                                "name", savedCredential.getName(),
                                "email", savedCredential.getEmail(),
                                "role", savedCredential.getRole() != null ? savedCredential.getRole() : "CANDIDATE"
                        )
                )))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "success", false,
                        "message", "Invalid email or password"
                )));
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

