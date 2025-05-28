package com.groupf.Backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.groupf.Backend.model.Category;
import com.groupf.Backend.service.CategoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CategoryController.class)
@AutoConfigureMockMvc(addFilters = false)
class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper mapper;

    @MockitoBean
    private CategoryService categoryService;

    private Category c;

    @BeforeEach
    void setUp() {
        c = new Category();
        c.setId(1L);
        c.setName("Cat1");
        c.setOrderIndex(0);
    }

    @Test
    void getAllCategories_returns200AndList() throws Exception {
        when(categoryService.getAllCategories()).thenReturn(List.of(c));

        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Cat1"));
        verify(categoryService).getAllCategories();
    }

    @Test
    void getAllCategories_empty_returns200AndEmptyList() throws Exception {
        when(categoryService.getAllCategories()).thenReturn(List.of());

        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
        verify(categoryService).getAllCategories();
    }

    @Test
    void addCategory_returns201AndBody() throws Exception {
        when(categoryService.addCategory(any(Category.class))).thenReturn(c);

        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(c)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));
        verify(categoryService).addCategory(any(Category.class));
    }

    @Test
    void addCategory_duplicateName_returns409() throws Exception {
        when(categoryService.addCategory(any(Category.class)))
                .thenThrow(new ResponseStatusException(HttpStatus.CONFLICT, "Kategorinamn finns redan."));

        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(c)))
                .andExpect(status().isConflict());
        verify(categoryService).addCategory(any(Category.class));
    }

    @Test
    void updateCategory_returns200AndBody() throws Exception {
        c.setName("NewName");
        when(categoryService.updateCategory(eq(1L), any(Category.class))).thenReturn(c);

        mockMvc.perform(put("/api/categories/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(c)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("NewName"));
        verify(categoryService).updateCategory(eq(1L), any(Category.class));
    }

    @Test
    void updateCategory_notFound_returns404() throws Exception {
        when(categoryService.updateCategory(eq(1L), any(Category.class)))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        mockMvc.perform(put("/api/categories/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(c)))
                .andExpect(status().isNotFound());
        verify(categoryService).updateCategory(eq(1L), any(Category.class));
    }

    @Test
    void deleteCategory_returns204() throws Exception {
        mockMvc.perform(delete("/api/categories/1"))
                .andExpect(status().isNoContent());
        verify(categoryService).deleteCategory(1L);
    }

    @Test
    void reorderCategories_success_returns200() throws Exception {
        Category category1 = new Category();
        category1.setId(1L);
        category1.setOrderIndex(1);

        Category category2 = new Category();
        category2.setId(2L);
        category2.setOrderIndex(2);

        List<Category> categories = List.of(category1, category2);

        mockMvc.perform(put("/api/categories/reorder")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(categories)))
                .andExpect(status().isOk());

        verify(categoryService).reorderCategories(categories);
    }

    @Test
    void updateCategory_duplicateName_returns409() throws Exception {
        when(categoryService.updateCategory(eq(1L), any(Category.class)))
                .thenThrow(new ResponseStatusException(HttpStatus.CONFLICT, "Name already exists"));

        mockMvc.perform(put("/api/categories/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(c)))
                .andExpect(status().isConflict());
    }

    @Test
    void deleteCategory_notFound_returns404() throws Exception {
        doThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"))
                .when(categoryService).deleteCategory(1L);

        mockMvc.perform(delete("/api/categories/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateCategory_invalidId_returns400() throws Exception {
        mockMvc.perform(put("/api/categories/not-a-number")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(c)))
                .andExpect(status().isBadRequest());
    }
}
