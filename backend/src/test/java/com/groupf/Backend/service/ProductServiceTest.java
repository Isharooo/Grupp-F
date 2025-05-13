package com.groupf.Backend.service;

import com.groupf.Backend.model.OrderItem;
import com.groupf.Backend.model.Product;
import com.groupf.Backend.repository.OrderItemRepository;
import com.groupf.Backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;
    @Mock
    private OrderItemRepository orderItemRepository;

    @InjectMocks
    private ProductService productService;

    private Product sample;

    @BeforeEach
    void setUp() {
        sample = new Product();
        sample.setId(1L);
        sample.setName("TestProduct");
        sample.setArticleNumber(123L);
        sample.setPrice(9.99);
        sample.setCategoryId(1L);
        sample.setVisible(true);
    }

    @Test
    void testGetAllProducts() {
        when(productRepository.findAll()).thenReturn(List.of(sample));
        var result = productService.getAllProducts();
        assertEquals(1, result.size());
        verify(productRepository).findAll();
    }

    @Test
    void testGetProductById_nullId_throws() {
        var ex = assertThrows(ResponseStatusException.class,
                () -> productService.getProductById(null));
        assertEquals("ProductId saknas", ex.getReason());
    }

    @Test
    void testGetProductById_notFound_throws() {
        when(productRepository.findProductById(1L)).thenReturn(Optional.empty());
        var ex = assertThrows(ResponseStatusException.class,
                () -> productService.getProductById(1L));
        assertEquals("Produkt med id 1 hittades inte", ex.getReason());
    }

    @Test
    void testGetProductById_success() {
        when(productRepository.findProductById(1L)).thenReturn(Optional.of(sample));
        var result = productService.getProductById(1L);
        assertEquals(sample, result);
    }

    @Test
    void testAddProduct_valid() {
        when(productRepository.save(sample)).thenReturn(sample);
        var result = productService.addProduct(sample);
        assertEquals(sample, result);
    }

    @Test
    void testDeleteProduct_inUse_throws() {
        when(orderItemRepository.findByProductId(1L)).thenReturn(List.of(new OrderItem()));
        var ex = assertThrows(ResponseStatusException.class,
                () -> productService.deleteProduct(1L));
        assertEquals("Product is in use by orders and cannot be deleted.", ex.getReason());
    }

    @Test
    void testExistsByArticleNumber() {
        when(productRepository.existsByArticleNumber(123L)).thenReturn(true);
        assertTrue(productService.existsByArticleNumber(123L));
    }

    @Test
    void testGetVisibleProductsPaginated_noFilters() {
        Page<Product> page = new PageImpl<>(List.of(sample));
        when(productRepository.findByVisibleTrue(any(Pageable.class))).thenReturn(page);
        var result = productService.getVisibleProductsPaginated(0, 10, null, null);
        assertEquals(1, result.getTotalElements());
    }
}
