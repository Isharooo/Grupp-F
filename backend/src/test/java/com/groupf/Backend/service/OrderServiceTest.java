package com.groupf.Backend.service;

import com.groupf.Backend.model.Order;
import com.groupf.Backend.model.OrderItem;
import com.groupf.Backend.model.Product;
import com.groupf.Backend.repository.OrderRepository;
import com.groupf.Backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    private Order sampleOrder;
    private OrderItem sampleItem;
    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        sampleOrder = new Order();
        sampleOrder.setId(1L);
        sampleOrder.setCustomerName("Alice");
        sampleOrder.setCreationDate(LocalDate.now());

        sampleItem = new OrderItem();
        sampleItem.setOrderId(1L);
        sampleItem.setProductId(2L);
        sampleItem.setQuantity(4L);

        sampleProduct = new Product();
        sampleProduct.setId(2L);
        sampleProduct.setName("Widget");
    }

    @Test
    void testGetAllOrders() {
        when(orderRepository.findAll()).thenReturn(List.of(sampleOrder));
        var result = orderService.getAllOrders();
        assertEquals(1, result.size());
    }

    @Test
    void testGetOrderById_notFound_throws() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> orderService.getOrderById(1L));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }


    @Test
    void testCreateOrder() {
        when(orderRepository.save(any(Order.class))).thenReturn(sampleOrder);
        var result = orderService.createOrder(sampleOrder);
        assertEquals(sampleOrder, result);
    }

    @Test
    void testGetActiveOrders_notFound_throws() {
        when(orderRepository.findAllActiveOrders()).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> orderService.getActiveOrders());
    }

    @Test
    void testChangeOrderStatus_sent() {
        sampleOrder.setSendDate(LocalDate.now());
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(sampleOrder)).thenReturn(sampleOrder);
        var result = orderService.changeOrderStatus(1L, true);
        assertTrue(result.isCompleted());
    }

    @Test
    void testDeleteOrder() {
        doNothing().when(orderRepository).deleteById(1L);
        orderService.deleteOrder(1L);
        verify(orderRepository).deleteById(1L);
    }

    @Test
    void testGenerateOrderPdf_notFound_throws() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> orderService.generateOrderPdf(1L));
    }
}
