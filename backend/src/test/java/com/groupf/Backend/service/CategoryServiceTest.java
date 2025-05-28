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
import org.springframework.http.HttpStatus;
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
        sample.setName("mejeri");
        sample.setOrderIndex(0);
    }

    @Test
    void addCategory_savesCategory_whenNameIsUnique() {
        when(categoryRepository.existsByName("mejeri")).thenReturn(false);
        when(categoryRepository.save(sample)).thenReturn(sample);

        Category result = categoryService.addCategory(sample);

        assertEquals("mejeri", result.getName());
        verify(categoryRepository).save(sample);
    }

    @Test
    void addCategory_throwsConflict_whenNameExists() {
        when(categoryRepository.existsByName("mejeri")).thenReturn(true);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> categoryService.addCategory(sample));

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
    }

    @Test
    void getAllCategories_returnsSortedList() {
        List<Category> mockList = List.of(sample);
        when(categoryRepository.findAll(Sort.by("orderIndex"))).thenReturn(mockList);

        List<Category> result = categoryService.getAllCategories();

        assertEquals(1, result.size());
        assertEquals("mejeri", result.get(0).getName());
    }

    @Test
    void deleteCategory_movesProductsToNoCategoryAndDeletesCategory() {
        Category noCategory = new Category();
        noCategory.setId(99L);
        noCategory.setName("noCategory");

        Product p1 = new Product();
        p1.setId(1L);
        p1.setCategoryId(1L);

        when(categoryRepository.findAll()).thenReturn(List.of(sample, noCategory));
        when(productRepository.findAll()).thenReturn(List.of(p1));

        categoryService.deleteCategory(1L);

        assertEquals(99L, p1.getCategoryId());
        verify(productRepository).save(p1);
        verify(categoryRepository).deleteById(1L);
    }

    @Test
    void deleteCategory_throwsException_whenNoCategoryMissing() {
        when(categoryRepository.findAll()).thenReturn(List.of(sample));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> categoryService.deleteCategory(1L));

        assertEquals("noCategory category missing!", exception.getMessage());
    }

    @Test
    void updateCategory_updatesName_whenChanged() {
        Category updated = new Category();
        updated.setName("nyttnamn");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sample));
        when(categoryRepository.save(any(Category.class))).thenReturn(sample);

        Category result = categoryService.updateCategory(1L, updated);

        verify(categoryRepository).save(sample);
        assertEquals("nyttnamn", sample.getName());
    }

    @Test
    void reorderCategories_updatesCategories() {
        Category updated = new Category();
        updated.setId(1L);
        updated.setName("uppdaterad");
        updated.setOrderIndex(5);

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sample));

        categoryService.reorderCategories(List.of(updated));

        verify(categoryRepository).save(sample);
        assertEquals("uppdaterad", sample.getName());
        assertEquals(5, sample.getOrderIndex());
    }

}
