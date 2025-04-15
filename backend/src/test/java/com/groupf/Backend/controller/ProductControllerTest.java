package com.groupf.Backend.controller;

import com.groupf.Backend.model.Product;
import com.groupf.Backend.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;

@WebMvcTest(ProductController.class)
@Import(ProductControllerTest.TestConfig.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ProductService productService;

    @BeforeEach
    void setUp() {
        Mockito.reset(productService);
    }

    @TestConfiguration
    static class TestConfig {
        @Bean
        @Primary
        public ProductService productService() {
            return Mockito.mock(ProductService.class);
        }
    }

    @Test
    public void getAllProducts_ShouldReturnProducts() throws Exception {
        Product product1 = new Product(1L, 2323L, "Kaffe", "12 * 450g", 90.0, "img_kaffe.jpg", 1L);
        Product product2 = new Product(2L, 3444L, "Tahini", "6 * 1l", 95.0, "img_tahini.jpg", 2L);
        List<Product> products = Arrays.asList(product1, product2);

        Mockito.when(productService.getAllProducts()).thenReturn(products);

        mvc.perform(MockMvcRequestBuilders.get("/api/products")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("Kaffe"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].price").value(95.0));
    }

    @Test
    public void getProductById_ValidId_ShouldReturnProduct() throws Exception {
        Product product = new Product(1L, 2323L, "Kaffe", "12 * 450g", 90.0, "img_kaffe.jpg", 1L);
        Mockito.when(productService.getProductById(1L)).thenReturn(product);

        mvc.perform(MockMvcRequestBuilders.get("/api/products/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Kaffe"));
    }

    @Test
    public void getProductById_InvalidId_ShouldReturnNotFound() throws Exception {
        Mockito.when(productService.getProductById(999L)).thenThrow(
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found")
        );

        mvc.perform(MockMvcRequestBuilders.get("/api/products/999"))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void getAllProducts_EmptyList_ShouldReturnOk() throws Exception {
        Mockito.when(productService.getAllProducts()).thenReturn(List.of());

        mvc.perform(MockMvcRequestBuilders.get("/api/products"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(0));
    }
}