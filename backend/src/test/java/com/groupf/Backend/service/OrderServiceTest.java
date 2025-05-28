package com.groupf.Backend.service;

import com.groupf.Backend.model.Order;
import com.groupf.Backend.model.OrderItem;
import com.groupf.Backend.model.Product;
import com.groupf.Backend.repository.OrderRepository;
import com.groupf.Backend.repository.ProductRepository;

import jakarta.transaction.Transactional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemService orderItemService;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private OrderService orderService;

    private Order sampleOrder;
    private OrderItem sampleItem;
    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        sampleOrder = new Order();
        sampleOrder.setId(1L);
        sampleOrder.setCustomerName("Alice");
        sampleOrder.setCreatedBy("user123");
        sampleOrder.setCreationDate(LocalDate.of(2025, 5, 1));

        sampleItem = new OrderItem();
        sampleItem.setOrderId(1L);
        sampleItem.setProductId(2L);
        sampleItem.setQuantity(4L);

        sampleProduct = new Product();
        sampleProduct.setId(2L);
        sampleProduct.setName("Widget");
    }

    @Test
    void getAllOrders_returnsOrderList() {
        when(orderRepository.findAll()).thenReturn(List.of(sampleOrder));

        List<Order> result = orderService.getAllOrders();

        assertEquals(1, result.size());
        assertEquals("Alice", result.get(0).getCustomerName());
    }

    @Test
    void getOrdersByUserId_returnsUserOrders() {
        when(orderRepository.findByCreatedBy("user123")).thenReturn(List.of(sampleOrder));

        List<Order> result = orderService.getOrdersByUserId("user123");

        assertEquals(1, result.size());
        assertEquals("Alice", result.get(0).getCustomerName());
    }

    @Test
    void getOrderById_returnsOrder() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));

        Order result = orderService.getOrderById(1L);

        assertEquals("Alice", result.getCustomerName());
    }

    @Test
    void getOrderById_throwsNotFound_whenOrderMissing() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> orderService.getOrderById(1L));
    }

    @Test
    void createOrder_setsCreationDateAndUserId() {
        Order newOrder = new Order();
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        Order saved = orderService.createOrder(newOrder, "user123");

        assertEquals(LocalDate.now(), saved.getCreationDate());
        assertEquals("user123", saved.getCreatedBy());
    }

    @Test
    void changeOrderStatus_marksAsSent() {
        sampleOrder.setSendDate(LocalDate.of(2025, 5, 27));
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(sampleOrder);

        Order result = orderService.changeOrderStatus(1L, true);

        assertTrue(result.isCompleted());
        assertEquals(LocalDate.now(), result.getSendDate());
    }

    @Test
    void changeOrderStatus_throwsBadRequest_whenSendDateMissing() {
        sampleOrder.setSendDate(null);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));

        assertThrows(ResponseStatusException.class, () -> orderService.changeOrderStatus(1L, true));
    }

    @Test
    void updateOrder_updatesFields() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(sampleOrder);

        Order result = orderService.updateOrder(1L, "Bob", LocalDate.of(2025, 6, 1));

        assertEquals("Bob", result.getCustomerName());
        assertEquals(LocalDate.of(2025, 6, 1), result.getSendDate());
    }

    @Test
    void changeCompleteStatus_togglesCompleted() {
        sampleOrder.setCompleted(false);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(sampleOrder);

        Order result = orderService.changeCompleteStatus(1L);

        assertTrue(result.isCompleted());
    }

    @Test
    void changeCompleteStatus_throwsNotFound() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> orderService.changeCompleteStatus(1L));

        assertEquals(404, ex.getStatusCode().value());
    }

    @Test
    void deleteOrder_deletesById() {
        orderService.deleteOrder(1L);

        verify(orderRepository).deleteById(1L);
    }

    @Test
    void generateOrderPdf_returnsPdfBytes() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));
        when(orderItemService.getOrderItemsByOrderId(1L)).thenReturn(List.of(sampleItem));
        when(productRepository.findAllById(List.of(2L))).thenReturn(List.of(sampleProduct));

        byte[] result = orderService.generateOrderPdf(1L);

        assertNotNull(result);
        assertTrue(result.length > 0);
    }
}
