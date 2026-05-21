package com.example.JobProject.Service;

import com.example.JobProject.Repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
@Service
public class PostService {

    @Autowired
    PostRepository repo;



    public List<Post> GetPost(){
       return repo.findAll();
    }

    public Post addPost( Post post){
        return repo.save(post);
    }

    public void deletePost(String id){
         repo.deleteById(id);
        System.out.println("the post with " +id+ " is deleted");
    }
}

