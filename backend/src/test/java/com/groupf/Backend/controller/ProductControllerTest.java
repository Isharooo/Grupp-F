package com.groupf.Backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.groupf.Backend.model.Product;
import com.groupf.Backend.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
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
    void getProductById_found_returns200AndBody() throws Exception {
        given(productService.getProductById(1L)).willReturn(p);

        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test"));
    }


    @Test
    void getAllProductsByCategory_returns200AndList() throws Exception {
        given(productService.getAllProductsByCategory("Cat")).willReturn(List.of(p));

        mockMvc.perform(get("/api/products/categories/Cat"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void getVisibleProductsPaginated_returns200AndPage() throws Exception {
        given(productService.getVisibleProductsPaginated(eq(0), eq(10), isNull(), isNull()))
                .willReturn(new org.springframework.data.domain.PageImpl<>(
                        List.of(p),
                        org.springframework.data.domain.PageRequest.of(0,10),
                        1
                ));

        mockMvc.perform(get("/api/products/paginated/visible")
                        .param("page","0")
                        .param("size","10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1));
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
    void updateProduct_invalidJson_returns400() throws Exception {
        given(productService.findById(1L)).willReturn(Optional.of(p));

        mockMvc.perform(put("/api/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                .content("\"not-a-json\""))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateProduct_emptyBody_returns404() throws Exception {
        mockMvc.perform(put("/api/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteProduct_returns204() throws Exception {
        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isNoContent());
        then(productService).should().deleteProduct(1L);
    }

    @Test
    void checkArticleNumber_returns200AndMap() throws Exception {
        given(productService.existsByArticleNumber(123L)).willReturn(true);

        mockMvc.perform(get("/api/products/check-article-number")
                        .param("articleNumber","123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exists").value(true));
    }

    /*@Test
    void getVisibleProducts_returns200AndList() throws Exception {
        given(productService.getVisibleProducts()).willReturn(List.of(p));

        mockMvc.perform(get("/api/products/visible"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }*/
}
