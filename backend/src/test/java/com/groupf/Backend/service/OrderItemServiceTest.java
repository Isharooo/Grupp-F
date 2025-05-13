package com.groupf.Backend.service;

import com.groupf.Backend.model.OrderItem;
import com.groupf.Backend.repository.OrderItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderItemServiceTest {

    @Mock
    private OrderItemRepository orderItemRepository;

    @InjectMocks
    private OrderItemService orderItemService;

    private OrderItem sample;

    @BeforeEach
    void setUp() {
        sample = new OrderItem();
        sample.setId(1L);
        sample.setOrderId(1L);
        sample.setProductId(1L);
        sample.setQuantity(2L);
    }

    @Test
    void testGetAllOrderItems() {
        when(orderItemRepository.findAll()).thenReturn(List.of(sample));
        var result = orderItemService.getAllOrderItems();
        assertEquals(1, result.size());
    }

    @Test
    void testAddOrderItem() {
        when(orderItemRepository.save(sample)).thenReturn(sample);
        var result = orderItemService.addOrderItem(sample);
        assertEquals(sample, result);
    }

    @Test
    void testDeleteOrderItem() {
        doNothing().when(orderItemRepository).deleteById(1L);
        orderItemService.deleteOrderItem(1L);
        verify(orderItemRepository).deleteById(1L);
    }

    @Test
    void testGetOrderItemsByOrderId() {
        when(orderItemRepository.findByOrderId(1L)).thenReturn(List.of(sample));
        var result = orderItemService.getOrderItemsByOrderId(1L);
        assertEquals(1, result.size());
    }

    @Test
    void testGetOrderItemsByOrderIdAndProductId() {
        when(orderItemRepository.findByOrderIdAndProductId(1L,1L)).thenReturn(List.of(sample));
        var result = orderItemService.getOrderItemsByOrderIdAndProductId(1L, 1L);
        assertEquals(1, result.size());
    }
}
