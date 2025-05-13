package com.groupf.Backend.service;

import com.groupf.Backend.model.Category;
import com.groupf.Backend.model.Product;
import com.groupf.Backend.repository.CategoryRepository;
import com.groupf.Backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private CategoryService categoryService;

    private Category sample;

    @BeforeEach
    void setUp() {
        sample = new Category();
        sample.setId(1L);
        sample.setName("TestCat");
        sample.setOrderIndex(0);
    }

    @Test
    void testAddCategory() {
        when(categoryRepository.existsByName("TestCat")).thenReturn(false);
        when(categoryRepository.save(sample)).thenReturn(sample);
        var result = categoryService.addCategory(sample);
        assertEquals(sample, result);
    }

    @Test
    void testGetAllCategories() {
        when(categoryRepository.findAll(Sort.by("orderIndex"))).thenReturn(List.of(sample));
        var result = categoryService.getAllCategories();
        assertEquals(1, result.size());
    }

    @Test
    void testDeleteCategory_reassignsAndDeletes() {
        var noCat = new Category();
        noCat.setId(99L);
        noCat.setName("noCategory");
        when(categoryRepository.findAll()).thenReturn(List.of(noCat, sample));
        when(productRepository.findAll()).thenReturn(List.of(new Product() {{
            setCategoryId(1L);
        }}));
        categoryService.deleteCategory(1L);
        verify(productRepository).save(any(Product.class));
        verify(categoryRepository).deleteById(1L);
    }

    @Test
    void testUpdateCategory_notFound_throws() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());
        var ex = assertThrows(ResponseStatusException.class,
                () -> categoryService.updateCategory(1L, sample));
        assertEquals("Category not found", ex.getReason());
    }



}
