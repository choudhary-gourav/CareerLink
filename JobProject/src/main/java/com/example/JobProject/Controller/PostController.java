package com.example.JobProject.Controller;

import com.example.JobProject.Repository.PostRepository;
import com.example.JobProject.Repository.SearchRepoImpl;
import com.example.JobProject.Service.Post;
import com.example.JobProject.Service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PostController {

    @Autowired
    PostService postService;

    @Autowired
    SearchRepoImpl srepo;

    @GetMapping("/post")
    public List<Post> getPost() {
        return postService.GetPost();
    }

    @PostMapping("/post/{text}")
    public List<Post> search(@PathVariable String text) {
        return srepo.findBytext(text);
    }

    @PostMapping("/post")
    public void addPost(@RequestBody Post post) {
        postService.addPost(post);
    }

    @PutMapping("/post")
    public void updatePost(@RequestBody Post post) {
        postService.addPost(post); 
    }

    @DeleteMapping("/post/{id}")
    public String deletePost(@PathVariable String id) {
        postService.deletePost(id);
        return "Post deleted successfully with id: " + id;
    }

}

