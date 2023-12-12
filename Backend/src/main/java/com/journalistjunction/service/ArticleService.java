package com.journalistjunction.service;

import com.journalistjunction.model.Article;
import com.journalistjunction.repository.ArticleRepository;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArticleService {
    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    public void addArticle(Article article) {
        article.setReadyToBePosted(false);
        article.setPostTime(null);
        article.setViews(0L);
        articleRepository.save(article);
    }

    public Article getArticleById(Long id) {
        return articleRepository.findById(id).orElse(null);
    }

    public void updateArticleById(Long id, Article articleUpdater) {
        Article articleFromDb = articleRepository.findById(id).orElse(null);
        assert articleFromDb != null;
        articleFromDb.setTitle(articleUpdater.getTitle());
        articleFromDb.setShortDescription(articleUpdater.getShortDescription());
        articleFromDb.setBody(articleUpdater.getBody());
        articleFromDb.setCategories(articleUpdater.getCategories());
        articleFromDb.setLocation(articleUpdater.getLocation());
        articleFromDb.setLanguage(articleUpdater.getLanguage());

        articleRepository.save(articleFromDb);
    }

    public void deleteArticleById(Long id) {
        articleRepository.deleteById(id);
    }
}
