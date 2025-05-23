package com.groupf.Backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.groupf.Backend.model.Order;
import com.groupf.Backend.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper mapper;
    @MockitoBean OrderService orderService;

    private Order o;

    @BeforeEach
    void setUp() {
        o = new Order();
        o.setId(1L);
        o.setCustomerName("Alice");
        o.setCreationDate(LocalDate.now());
        o.setCompleted(false);
    }

    @Test
    void getAllOrders_returns200AndList() throws Exception {
        when(orderService.getAllOrders()).thenReturn(List.of(o));

        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].customerName").value("Alice"));
    }

    @Test
    void getOrderById_found_returns200AndBody() throws Exception {
        when(orderService.getOrderById(1L)).thenReturn(o);

        mockMvc.perform(get("/api/orders/order/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerName").value("Alice"));
    }

    @Test
    void getOrderById_notFound_returns404() throws Exception {
        when(orderService.getOrderById(1L))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Order ej funnen"));

        mockMvc.perform(get("/api/orders/order/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createOrder_returns201AndBody() throws Exception {
        when(orderService.createOrder(any(Order.class), anyString())).thenReturn(o);

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(o)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void createOrder_invalidJson_returns400() throws Exception {
        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("\"not-a-json\""))
                .andExpect(status().isBadRequest());
    }

   /* @Test
    void updateOrder_returns200AndBody() throws Exception {
        OrderUpdateDTO dto = new OrderUpdateDTO();
        dto.setCustomerName("Bob");
        dto.setSendDate(LocalDate.of(2025,5,20));

        Order updated = new Order();
        updated.setId(1L);
        updated.setCustomerName("Bob");
        updated.setSendDate(dto.getSendDate());

        when(orderService.updateOrder(eq(1L), eq("Bob"), eq(dto.getSendDate())))
                .thenReturn(updated);

        mockMvc.perform(put("/api/orders/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerName").value("Bob"))
                .andExpect(jsonPath("$.sendDate").value("2025-05-20"));
    }*/

    @Test
    void updateOrder_invalidJson_returns400() throws Exception {
        mockMvc.perform(put("/api/orders/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("\"not-a-json\""))
                .andExpect(status().isBadRequest());
    }

    @Test
    void changeCompleteStatus_returns200AndBody() throws Exception {
        o.setCompleted(true);
        when(orderService.changeCompleteStatus(1L)).thenReturn(o);

        mockMvc.perform(put("/api/orders/change_status/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(true));
    }

    @ParameterizedTest
    @ValueSource(strings = {"true","false"})
    void updateOrderStatus_parametrized_returns200AndBody(String markAsSent) throws Exception {
        when(orderService.changeOrderStatus(1L, Boolean.parseBoolean(markAsSent)))
                .thenReturn(o);

        mockMvc.perform(put("/api/orders/1/status")
                        .param("markAsSent", markAsSent))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(o.isCompleted()));

        verify(orderService).changeOrderStatus(1L, Boolean.parseBoolean(markAsSent));
    }

    @Test
    void updateOrderStatus_missingParam_returns400() throws Exception {
        mockMvc.perform(put("/api/orders/1/status"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateOrderStatus_invalidParam_returns400() throws Exception {
        mockMvc.perform(put("/api/orders/1/status")
                        .param("markAsSent", "notBoolean"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteOrder_returns204() throws Exception {
        mockMvc.perform(delete("/api/orders/1"))
                .andExpect(status().isNoContent());
        verify(orderService).deleteOrder(1L);
    }

    @Test
    void downloadOrderPdf_returns200AndPdf() throws Exception {
        byte[] pdf = new byte[]{1,2,3};
        when(orderService.generateOrderPdf(1L)).thenReturn(pdf);

        mockMvc.perform(get("/api/orders/1/pdf"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "application/pdf"))
                .andExpect(content().bytes(pdf));
    }

    @Test
    void downloadOrderPdf_serviceError_returns500() throws Exception {
        when(orderService.generateOrderPdf(1L))
                .thenThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "DB error"));

        mockMvc.perform(get("/api/orders/1/pdf"))
                .andExpect(status().isInternalServerError());
    }
}
