package com.groupf.Backend.service;

import com.groupf.Backend.model.Category;
import com.groupf.Backend.model.Product;
import com.groupf.Backend.repository.CategoryRepository;
import com.groupf.Backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


import java.util.List;
import java.util.Objects;
import jakarta.transaction.Transactional;


@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }


    @Transactional
    public Category addCategory(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Kategorinamn finns redan.");
        }
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Transactional
    public void deleteCategory(Long id) {
        // 1. Hämta noCategorie-kategorins id
        Category noCategory = categoryRepository.findAll().stream()
                .filter(cat -> "noCategorie".equalsIgnoreCase(cat.getName()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("noCategorie category missing!"));

        // 2. Hämta alla produkter med denna kategori
        List<Product> products = productRepository.findAll().stream()
                .filter(p -> id.equals(p.getCategoryId()))
                .toList();

        // 3. Flytta produkterna till noCategorie
        for (Product p : products) {
            p.setCategoryId(noCategory.getId());
            productRepository.save(p);
        }

        // 4. Ta bort kategorin
        categoryRepository.deleteById(id);
    }

    public Category updateCategory(Long id, Category category) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        if (category.getName() != null && !category.getName().isEmpty() && !Objects.equals(existingCategory.getName(), category.getName())) {
            existingCategory.setName(category.getName());
        }

        return categoryRepository.save(existingCategory);
    }

    @Transactional
    public void reorderCategories(List<Category> categories) {
        for (Category updated : categories) {
            Category existing = categoryRepository.findById(updated.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
            existing.setOrderIndex(updated.getOrderIndex());
            categoryRepository.save(existing);
        }
    }
}
