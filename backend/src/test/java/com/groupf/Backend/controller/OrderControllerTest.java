package com.groupf.Backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.groupf.Backend.dto.OrderUpdateDTO;
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

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

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


    @Test
    void getOrderById_ValidId_ShouldReturnOrder() throws Exception {
        Order order = new Order(1L,"Ica", LocalDate.now(),LocalDate.now().plusWeeks(1),false);
        Mockito.when(orderService.getOrderById(order.getId())).thenReturn(order);

        mvc.perform(MockMvcRequestBuilders.get("/api/orders/order/{id}", order.getId()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.customerName").value("Ica"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(order.getId()));
    }

    @Test
    void getOrderById_InvalidId_ShouldReturnNotFound() throws Exception {
        Long invalidId = 999L;
        Mockito.doThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"))
                .when(orderService).getOrderById(invalidId);

        mvc.perform(MockMvcRequestBuilders.get("/api/orders/order/{id}", invalidId))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }


    @Test
    void createOrder_CorrectOrder_ShouldReturnOrder() throws Exception {
        Order order = new Order(1L,"Ica", LocalDate.now(),LocalDate.now().plusWeeks(1),false);
        Mockito.when(orderService.createOrder(order)).thenReturn(order);

        mvc.perform(MockMvcRequestBuilders.post("/api/orders", order)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(order)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.customerName").value("Ica"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(order.getId()));
    }

    @Test
    void updateOrder_ValidInput_ShouldReturnUpdatedOrder() throws Exception {
        Long orderId = 1L;
        OrderUpdateDTO updateDTO = new OrderUpdateDTO("Ica Updated", LocalDate.now().plusDays(2));
        Order updatedOrder = new Order(orderId, updateDTO.getCustomerName(), LocalDate.now(), updateDTO.getSendDate(), true);

        Mockito.when(orderService.updateOrder(orderId, updateDTO.getCustomerName(), updatedOrder.getSendDate()))
                .thenReturn(updatedOrder);

        mvc.perform(MockMvcRequestBuilders.put("/api/orders/{id}", orderId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(updateDTO)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.customerName").value(updateDTO.getCustomerName()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.sendDate").exists());
    }

    @Test
    void updateOrderStatus_MarkAsSent_ShouldUpdateStatus() throws Exception {
        Long orderId = 1L;
        boolean markAsSent = true;
        Order updatedOrder = new Order(orderId, "ICA", LocalDate.now(), LocalDate.now().plusWeeks(1), markAsSent);

        Mockito.when(orderService.changeOrderStatus(orderId, markAsSent))
                .thenReturn(updatedOrder);

        mvc.perform(MockMvcRequestBuilders.put("/api/orders/{id}/status", orderId)
                        .param("markAsSent", String.valueOf(markAsSent)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.completed").value(true));
    }


    private String asJsonString(final Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}