package com.example.JobProject;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.beans.factory.annotation.Autowired;
import com.example.JobProject.Repository.CredentialRepository;

@SpringBootTest
class JobProjectApplicationTests {

	@Autowired
	private CredentialRepository credentialRepository;

	@Test
	void contextLoads() {
		long count = credentialRepository.count();
		System.out.println("=== VERIFICATION SUCCESS ===");
		System.out.println("Successfully connected to MongoDB Atlas!");
		System.out.println("Documents count in Credential collection: " + count);
		System.out.println("============================");
	}

}

