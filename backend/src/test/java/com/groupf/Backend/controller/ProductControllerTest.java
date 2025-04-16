package com.groupf.Backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
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

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@WebMvcTest(ProductController.class)
@Import(ProductControllerTest.TestConfig.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ProductService productService;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

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

    @Test
    void addProduct_ValidProduct_ShouldReturnCreated() throws Exception {
        Product newProduct = new Product(1L, 2323L, "Kaffe", "12 * 450g", 90.0, "img_kaffe.jpg", 1L);

        Product savedProduct = new Product(1L, 2323L, "Kaffe", "12 * 450g", 90.0, "img_kaffe.jpg", 1L);

        Mockito.when(productService.addProduct(Mockito.any(Product.class))).thenReturn(savedProduct);

        mvc.perform(MockMvcRequestBuilders.post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(newProduct)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Kaffe"));
    }

    @Test
    void updateProduct_ValidInput_ShouldReturnUpdatedProduct() throws Exception {
        Long productId = 1L;
        Product updateRequest = new Product();
        updateRequest.setName("Uppdaterad Kaffe");
        updateRequest.setPrice(100.0);

        Product updatedProduct = new Product(1L, 2323L, "Uppdaterad Kaffe", "12 * 450g", 100.0, "img_kaffe.jpg", 1L);

        Mockito.when(productService.updateProduct(Mockito.eq(productId), Mockito.any(Product.class)))
                .thenReturn(updatedProduct);

        mvc.perform(MockMvcRequestBuilders.put("/api/products/{productId}", productId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(updateRequest)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Uppdaterad Kaffe"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.price").value(100.0));
    }

    private String asJsonString(final Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}