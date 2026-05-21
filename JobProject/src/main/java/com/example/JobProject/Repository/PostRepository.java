package com.example.JobProject.Repository;

import com.example.JobProject.Service.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepository extends MongoRepository<Post, String> {
}

