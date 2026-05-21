package com.example.JobProject.Repository;

import com.example.JobProject.Model.Credential;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CredentialRepository extends MongoRepository<Credential, String> {
    Optional<Credential> findByEmail(String email);
    Optional<Credential> findByEmailIgnoreCase(String email);
    Optional<Credential> findByWorkEmailIgnoreCase(String workEmail);
    List<Credential> findAllByEmailIgnoreCase(String email);
    List<Credential> findAllByWorkEmailIgnoreCase(String workEmail);
}

