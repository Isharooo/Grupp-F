package com.groupf.Backend.controller;

import com.groupf.Backend.model.Order;
import com.groupf.Backend.service.OrderService;
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

@WebMvcTest(OrderController.class)
@Import(OrderControllerTest.TestConfig.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private OrderService orderService;

    @BeforeEach
    void setUp() {
        Mockito.reset(orderService);
    }

    @TestConfiguration
    static class TestConfig {
        @Bean
        @Primary
        public OrderService orderService() {
            return Mockito.mock(OrderService.class);
        }
    }

    @Test
    void getAllOrders_WithOrders_ShouldReturnOrders() throws Exception {
        Order order1 = new Order(1L,"Ica", LocalDate.now(),LocalDate.now().plusWeeks(1),false);
        Order order2 = new Order(2L,"Coop", LocalDate.now(),LocalDate.now().plusWeeks(2),true);
        List<Order> orders = Arrays.asList(order1, order2);

        Mockito.when(orderService.getAllOrders()).thenReturn(orders);

        mvc.perform(MockMvcRequestBuilders.get("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].customerName").value("Ica"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].id").value(2));
    }

    @Test
    void getAllOrders_EmptyList_ShouldReturnOk() throws Exception {
        Mockito.when(orderService.getAllOrders()).thenReturn(List.of());

        mvc.perform(MockMvcRequestBuilders.get("/api/orders"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(0));
    }

    @Test
    void deleteOrder_ValidId_ShouldReturnNoContent() throws Exception {
        Long validId = 1L;
        Mockito.doNothing().when(orderService).deleteOrder(validId);

        mvc.perform(MockMvcRequestBuilders.delete("/api/orders/{id}", validId))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    void deleteOrder_InvalidId_ShouldReturnNotFound() throws Exception {
        Long invalidId = 999L;
        Mockito.doThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"))
                .when(orderService).deleteOrder(invalidId);

        mvc.perform(MockMvcRequestBuilders.delete("/api/orders/{id}", invalidId))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }
}