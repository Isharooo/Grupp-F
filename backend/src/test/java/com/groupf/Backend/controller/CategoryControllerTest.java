package com.groupf.Backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.groupf.Backend.model.Category;
import com.groupf.Backend.service.CategoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Arrays;
import java.util.List;

@WebMvcTest(CategoryController.class)
@Import(CategoryControllerTest.TestConfig.class)
class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CategoryService categoryService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        Mockito.reset(categoryService);
    }

    @TestConfiguration
    static class TestConfig {
        @Bean
        @Primary
        public CategoryService categoryService() {
            return Mockito.mock(CategoryService.class);
        }
    }

    @Test
    void addCategory_ValidCategory_ShouldReturnCreated() throws Exception {
        Category newCategory = new Category(1L,"Dryck");
        Category savedCategory = new Category(1L, "Dryck");

        Mockito.when(categoryService.addCategory(Mockito.any(Category.class))).thenReturn(savedCategory);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newCategory)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Dryck"));
    }

    @Test
    void getAllCategories_WithCategories_ShouldReturnList() throws Exception {
        Category category1 = new Category(1L, "Dryck");
        Category category2 = new Category(2L, "Snacks");
        List<Category> categories = Arrays.asList(category1, category2);

        Mockito.when(categoryService.getAllCategories()).thenReturn(categories);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/categories"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("Dryck"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].id").value(2L));
    }

    @Test
    void updateCategory_ValidInput_ShouldReturnUpdated() throws Exception {
        Long categoryId = 1L;
        Category updateRequest = new Category(categoryId,"Uppdaterad Dryck");
        Category updatedCategory = new Category(categoryId, "Uppdaterad Dryck");

        Mockito.when(categoryService.updateCategory(Mockito.eq(categoryId), Mockito.any(Category.class)))
                .thenReturn(updatedCategory);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/categories/{categoryId}", categoryId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Uppdaterad Dryck"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(categoryId));
    }

    @Test
    void getAllCategories_EmptyList_ShouldReturnOk() throws Exception {
        Mockito.when(categoryService.getAllCategories()).thenReturn(List.of());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/categories"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(0));
    }
}