package com.example.JobProject.Repository;

import com.example.JobProject.Service.Post;

import java.util.List;

public interface SearchRepository {

    List<Post> findBytext(String text);
}

