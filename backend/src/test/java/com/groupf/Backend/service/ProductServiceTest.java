package com.groupf.Backend.service;

import com.groupf.Backend.model.OrderItem;
import com.groupf.Backend.model.Product;
import com.groupf.Backend.repository.OrderItemRepository;
import com.groupf.Backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
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
    void testGetProductById_nullId_throwsBadRequest() {
        var ex = assertThrows(ResponseStatusException.class, () -> productService.getProductById(null));
        assertEquals("ProductId saknas", ex.getReason());
    }

    @Test
    void testGetProductById_notFound_throwsNotFound() {
        when(productRepository.findProductById(1L)).thenReturn(Optional.empty());
        var ex = assertThrows(ResponseStatusException.class, () -> productService.getProductById(1L));
        assertEquals("Produkt med id 1 hittades inte", ex.getReason());
    }

    @Test
    void testGetProductById_success() {
        when(productRepository.findProductById(1L)).thenReturn(Optional.of(sample));
        var result = productService.getProductById(1L);
        assertEquals(sample, result);
    }


    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"   "})
    void testGetAllProductsByCategory_blankOrNull_throwsBadRequest(String cat) {
        var ex = assertThrows(ResponseStatusException.class, () -> productService.getAllProductsByCategory(cat));
        assertEquals("Category måste anges", ex.getReason());
    }

    @Test
    void testGetAllProductsByCategory_notFound_throwsNotFound() {
        when(productRepository.findProductsByCategory("Foo")).thenReturn(Optional.empty());
        var ex = assertThrows(ResponseStatusException.class, () -> productService.getAllProductsByCategory("Foo"));
        assertEquals("Kategori 'Foo' hittades inte", ex.getReason());
    }

    @Test
    void testGetAllProductsByCategory_success() {
        when(productRepository.findProductsByCategory("Cat")).thenReturn(Optional.of(List.of(sample)));
        var result = productService.getAllProductsByCategory("Cat");
        assertEquals(1, result.size());
        assertEquals(sample, result.get(0));
    }

    @Test
    void testAddProduct_valid() {
        when(productRepository.save(sample)).thenReturn(sample);
        var result = productService.addProduct(sample);
        assertEquals(sample, result);
    }

    @ParameterizedTest
    @ValueSource(strings = { "", "   " })
    void testAddProduct_missingName_throwsBadRequest(String badName) {
        sample.setName(badName);
        var ex = assertThrows(ResponseStatusException.class, () -> productService.addProduct(sample));
        assertEquals("Name is required.", ex.getReason());
    }

    @Test
    void testAddProduct_missingArticleNumber_throwsBadRequest() {
        sample.setArticleNumber(null);
        var ex = assertThrows(ResponseStatusException.class, () -> productService.addProduct(sample));
        assertEquals("Article number is required.", ex.getReason());
    }

    @Test
    void testAddProduct_missingPrice_throwsBadRequest() {
        sample.setPrice(null);
        var ex = assertThrows(ResponseStatusException.class, () -> productService.addProduct(sample));
        assertEquals("Price is required.", ex.getReason());
    }

    @Test
    void testAddProduct_missingCategoryId_throwsBadRequest() {
        sample.setCategoryId(null);
        var ex = assertThrows(ResponseStatusException.class, () -> productService.addProduct(sample));
        assertEquals("Category is required.", ex.getReason());
    }

    @Test
    void testUpdateProduct_notFound_throwsRuntime() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());
        var updated = new Product();
        updated.setId(1L);
        assertThrows(RuntimeException.class, () -> productService.updateProduct(updated));
    }

    @Test
    void testUpdateProduct_success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(sample));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        sample.setName("NewName");
        sample.setPrice(5.0);
        var result = productService.updateProduct(sample);

        assertEquals("NewName", result.getName());
        assertEquals(5.0, result.getPrice());
    }


    @Test
    void testGetVisibleProductsPaginated_noFilters() {
        Page<Product> page = new PageImpl<>(List.of(sample));
        when(productRepository.findByVisibleTrue(any(Pageable.class))).thenReturn(page);

        var result = productService.getVisibleProductsPaginated(0, 10, null, null);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testGetVisibleProductsPaginated_searchOnly() {
        Page<Product> page = new PageImpl<>(List.of(sample));
        when(productRepository.findByVisibleTrueAndNameContainingIgnoreCase(eq("est"), any(Pageable.class)))
                .thenReturn(page);

        var result = productService.getVisibleProductsPaginated(0, 5, "est", null);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testGetVisibleProductsPaginated_categoryOnly() {
        Page<Product> page = new PageImpl<>(List.of(sample));
        when(productRepository.findByVisibleTrueAndCategoryId(eq(1L), any(Pageable.class)))
                .thenReturn(page);

        var result = productService.getVisibleProductsPaginated(1, 5, null, 1L);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testGetVisibleProductsPaginated_bothFilters() {
        Page<Product> page = new PageImpl<>(List.of(sample));
        when(productRepository.findByVisibleTrueAndNameContainingIgnoreCaseAndCategoryId(
                eq("Test"), eq(1L), any(Pageable.class)))
                .thenReturn(page);

        var result = productService.getVisibleProductsPaginated(2, 3, "Test", 1L);
        assertEquals(1, result.getTotalElements());
    }


    @Test
    void testDeleteProduct_inUse_throwsConflict() {
        when(orderItemRepository.findByProductId(1L)).thenReturn(List.of(new OrderItem()));
        var ex = assertThrows(ResponseStatusException.class, () -> productService.deleteProduct(1L));
        assertEquals("Product is in use by orders and cannot be deleted.", ex.getReason());
    }

    @Test
    void testDeleteProduct_notInUse_deletesSuccessfully() {
        when(orderItemRepository.findByProductId(1L)).thenReturn(List.of());
        doNothing().when(productRepository).deleteById(1L);

        productService.deleteProduct(1L);
        verify(productRepository).deleteById(1L);
    }


    @Test
    void testExistsByArticleNumber() {
        when(productRepository.existsByArticleNumber(123L)).thenReturn(true);
        assertTrue(productService.existsByArticleNumber(123L));
    }


}
