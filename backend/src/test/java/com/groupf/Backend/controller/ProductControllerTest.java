package com.groupf.Backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.groupf.Backend.model.Product;
import com.groupf.Backend.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
class ProductControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper mapper;
    @MockitoBean ProductService productService;

    private Product p;

    @BeforeEach
    void setUp() {
        p = new Product();
        p.setId(1L);
        p.setArticleNumber(100L);
        p.setName("Test");
        p.setPrice(5.0);
        p.setCategoryId(2L);
        p.setVisible(true);
    }

    @Test
    void getAllProducts_returns200AndList() throws Exception {
        given(productService.getAllProducts()).willReturn(List.of(p));
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void getAllProducts_empty_returns200AndEmptyList() throws Exception {
        given(productService.getAllProducts()).willReturn(Collections.emptyList());
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void getAllProducts_serviceError_returns500() throws Exception {
        given(productService.getAllProducts())
                .willThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Database error"));
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void getProductById_found_returns200AndBody() throws Exception {
        given(productService.getProductById(1L)).willReturn(p);
        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test"));
    }

    @Test
    void getProductById_notFound_returns404() throws Exception {
        given(productService.getProductById(1L))
                .willThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getProductById_invalidId_returns400() throws Exception {
        mockMvc.perform(get("/api/products/not-a-number"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getAllProductsByCategory_returns200AndList() throws Exception {
        given(productService.getAllProductsByCategory("Cat")).willReturn(List.of(p));
        mockMvc.perform(get("/api/products/categories/Cat"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void getAllProductsByCategory_empty_returns200AndEmptyList() throws Exception {
        given(productService.getAllProductsByCategory("Cat")).willReturn(Collections.emptyList());
        mockMvc.perform(get("/api/products/categories/Cat"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void getAllProductsByCategory_serviceError_returns500() throws Exception {
        given(productService.getAllProductsByCategory("Cat"))
                .willThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Service error"));
        mockMvc.perform(get("/api/products/categories/Cat"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void getVisibleProductsPaginated_returns200AndPage() throws Exception {
        Page<Product> page = new PageImpl<>(List.of(p), PageRequest.of(0, 10), 1);
        given(productService.getVisibleProductsPaginated(eq(0), eq(10), isNull(), isNull()))
                .willReturn(page);
        mockMvc.perform(get("/api/products/paginated/visible")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1));
    }

    @Test
    void getVisibleProductsPaginated_withSearchAndCategory_returns200AndPage() throws Exception {
        Page<Product> page = new PageImpl<>(List.of(p), PageRequest.of(0, 10), 1);
        given(productService.getVisibleProductsPaginated(eq(0), eq(10), eq("test"), eq(2L)))
                .willReturn(page);
        mockMvc.perform(get("/api/products/paginated/visible")
                        .param("page", "0")
                        .param("size", "10")
                        .param("search", "test")
                        .param("categoryId", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1));
    }

    @Test
    void getVisibleProductsPaginated_invalidPageParam_returns400() throws Exception {
        mockMvc.perform(get("/api/products/paginated/visible")
                        .param("page", "not-a-number")
                        .param("size", "10"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getVisibleProductsPaginated_invalidSizeParam_returns400() throws Exception {
        mockMvc.perform(get("/api/products/paginated/visible")
                        .param("page", "0")
                        .param("size", "invalid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getVisibleProductsPaginated_serviceError_returns500() throws Exception {
        given(productService.getVisibleProductsPaginated(eq(0), eq(10), isNull(), isNull()))
                .willThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Pagination error"));
        mockMvc.perform(get("/api/products/paginated/visible")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void addProduct_returns201AndBody() throws Exception {
        given(productService.addProduct(any(Product.class))).willReturn(p);
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(p)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.articleNumber").value(100));
    }

    @Test
    void addProduct_invalidJson_returns400() throws Exception {
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("invalid-json"))
                .andExpect(status().isBadRequest());
    }


    @Test
    void addProduct_duplicateArticleNumber_returns409() throws Exception {
        given(productService.addProduct(any(Product.class)))
                .willThrow(new ResponseStatusException(HttpStatus.CONFLICT, "Article number already exists"));
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(p)))
                .andExpect(status().isConflict());
    }

    @Test
    void addProduct_serviceError_returns500() throws Exception {
        given(productService.addProduct(any(Product.class)))
                .willThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Creation failed"));
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(p)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void updateProduct_exists_returns200AndBody() throws Exception {
        given(productService.findById(1L)).willReturn(Optional.of(p));
        given(productService.updateProduct(any(Product.class))).willReturn(p);
        mockMvc.perform(put("/api/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(p)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void updateProduct_notExists_returns404() throws Exception {
        given(productService.findById(1L)).willReturn(Optional.empty());
        mockMvc.perform(put("/api/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(p)))
                .andExpect(status().isNotFound());
    }


    @Test
    void updateProduct_invalidId_returns400() throws Exception {
        mockMvc.perform(put("/api/products/not-a-number")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(p)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateProduct_invalidJson_returns400() throws Exception {
        given(productService.findById(1L)).willReturn(Optional.of(p));
        mockMvc.perform(put("/api/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("\"not-a-json\""))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateProduct_serviceError_returns500() throws Exception {
        given(productService.findById(1L)).willReturn(Optional.of(p));
        given(productService.updateProduct(any(Product.class)))
                .willThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Update failed"));
        mockMvc.perform(put("/api/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(p)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void deleteProduct_returns204() throws Exception {
        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isNoContent());
        verify(productService).deleteProduct(1L);
    }

    @Test
    void deleteProduct_notFound_returns404() throws Exception {
        doThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"))
                .when(productService).deleteProduct(1L);
        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteProduct_invalidId_returns400() throws Exception {
        mockMvc.perform(delete("/api/products/not-a-number"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteProduct_serviceError_returns500() throws Exception {
        doThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Deletion failed"))
                .when(productService).deleteProduct(1L);
        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void checkArticleNumber_exists_returns200AndTrue() throws Exception {
        given(productService.existsByArticleNumber(123L)).willReturn(true);
        mockMvc.perform(get("/api/products/check-article-number")
                        .param("articleNumber", "123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exists").value(true));
    }

    @Test
    void checkArticleNumber_notExists_returns200AndFalse() throws Exception {
        given(productService.existsByArticleNumber(123L)).willReturn(false);
        mockMvc.perform(get("/api/products/check-article-number")
                        .param("articleNumber", "123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exists").value(false));
    }

    @Test
    void checkArticleNumber_invalidParam_returns400() throws Exception {
        mockMvc.perform(get("/api/products/check-article-number")
                        .param("articleNumber", "not-a-number"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void checkArticleNumber_serviceError_returns500() throws Exception {
        given(productService.existsByArticleNumber(123L))
                .willThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Check failed"));
        mockMvc.perform(get("/api/products/check-article-number")
                        .param("articleNumber", "123"))
                .andExpect(status().isInternalServerError());
    }
}