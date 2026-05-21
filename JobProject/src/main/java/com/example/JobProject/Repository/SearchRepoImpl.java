package com.example.JobProject.Repository;

import com.example.JobProject.Service.Post;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.stereotype.Component;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
@Component
public class SearchRepoImpl implements SearchRepository {

    @Autowired
    MongoClient Client;

    @Autowired
    MongoConverter converter;

    @Override
    public List<Post> findBytext(String text) {

        final List<Post> post = new ArrayList<>();



        MongoDatabase database = Client.getDatabase("Gourav");
        MongoCollection<Document> collection = database.getCollection("jobPosting");

        AggregateIterable<Document> result = collection.aggregate(Arrays.asList(new Document("$search",
                        new Document("text",
                                new Document("query", text)
                                        .append("path", Arrays.asList("tech", "desc", "profile")))),
                new Document("$sort",
                        new Document("exp", 1L))));

        result.forEach(doc -> post.add(converter.read(Post.class,doc)));

        return post;
    }




}

