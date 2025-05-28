package com.groupf.Backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.groupf.Backend.model.Order;
import com.groupf.Backend.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper mapper;

    @org.springframework.boot.test.mock.mockito.MockBean
    private OrderService orderService;

    private Order o;
    private JwtRequestPostProcessor jwtAdmin;

    @BeforeEach
    void setUp() {
        o = new Order();
        o.setId(1L);
        o.setCustomerName("Alice");
        o.setCreationDate(LocalDate.now());
        o.setCompleted(false);

        jwtAdmin = jwt().authorities(new SimpleGrantedAuthority("ROLE_admin"));
    }

    // =============================== getAllOrders ===============================
    @Test
    void getAllOrders_returns200AndList() throws Exception {
        when(orderService.getAllOrders()).thenReturn(List.of(o));
        mockMvc.perform(get("/api/orders/all").with(jwtAdmin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].customerName").value("Alice"));
        verify(orderService).getAllOrders();
    }

    @Test
    void getAllOrders_empty_returns200AndEmptyList() throws Exception {
        when(orderService.getAllOrders()).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/orders/all").with(jwtAdmin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void getAllOrders_serviceError_returns500() throws Exception {
        when(orderService.getAllOrders()).thenThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR));
        mockMvc.perform(get("/api/orders/all").with(jwtAdmin))
                .andExpect(status().isInternalServerError());
    }

    // =============================== getOrderById ===============================
    @Test
    void getOrderById_found_returns200AndBody() throws Exception {
        when(orderService.getOrderById(1L)).thenReturn(o);
        mockMvc.perform(get("/api/orders/order/1").with(jwtAdmin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerName").value("Alice"));
    }

    @Test
    void getOrderById_notFound_returns404() throws Exception {
        when(orderService.getOrderById(1L))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND));
        mockMvc.perform(get("/api/orders/order/1").with(jwtAdmin))
                .andExpect(status().isNotFound());
    }

    @Test
    void getOrderById_invalidId_returns400() throws Exception {
        mockMvc.perform(get("/api/orders/order/not-a-number").with(jwtAdmin))
                .andExpect(status().isBadRequest());
    }

    // =============================== getMyOrders ===============================
    @Test
    void getMyOrders_returns200AndList() throws Exception {
        when(orderService.getOrdersByUserId(anyString())).thenReturn(List.of(o));
        mockMvc.perform(get("/api/orders/my").with(jwtAdmin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].customerName").value("Alice"));
    }

    @Test
    void getMyOrders_empty_returns200AndEmptyList() throws Exception {
        when(orderService.getOrdersByUserId(anyString())).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/orders/my").with(jwtAdmin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void getMyOrders_serviceError_returns500() throws Exception {
        when(orderService.getOrdersByUserId(anyString()))
                .thenThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR));
        mockMvc.perform(get("/api/orders/my").with(jwtAdmin))
                .andExpect(status().isInternalServerError());
    }

    // =============================== createOrder ===============================
    @Test
    void createOrder_returns201AndBody() throws Exception {
        when(orderService.createOrder(any(Order.class), anyString())).thenReturn(o);
        mockMvc.perform(post("/api/orders").with(jwtAdmin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(o)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void createOrder_invalidJson_returns400() throws Exception {
        mockMvc.perform(post("/api/orders").with(jwtAdmin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("\"not-a-json\""))
                .andExpect(status().isBadRequest());
    }


    @Test
    void createOrder_serviceError_returns500() throws Exception {
        when(orderService.createOrder(any(Order.class), anyString()))
                .thenThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR));
        mockMvc.perform(post("/api/orders").with(jwtAdmin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(o)))
                .andExpect(status().isInternalServerError());
    }

    // =============================== updateOrder ===============================
    @Test
    void updateOrder_returns200AndBody() throws Exception {
        o.setCustomerName("Updated Name");
        when(orderService.updateOrder(eq(1L), anyString(), any(LocalDate.class))).thenReturn(o);

        mockMvc.perform(put("/api/orders/1").with(jwtAdmin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"customerName\":\"Updated Name\",\"sendDate\":\"2025-06-01\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerName").value("Updated Name"));
    }


    @Test
    void updateOrder_invalidJson_returns400() throws Exception {
        mockMvc.perform(put("/api/orders/1").with(jwtAdmin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("\"not-a-json\""))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateOrder_invalidId_returns400() throws Exception {
        mockMvc.perform(put("/api/orders/not-a-number").with(jwtAdmin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"customerName\":\"Updated Name\"}"))
                .andExpect(status().isBadRequest());
    }


    @Test
    void changeCompleteStatus_returns200AndBody() throws Exception {
        o.setCompleted(true);
        when(orderService.changeCompleteStatus(1L)).thenReturn(o);
        mockMvc.perform(put("/api/orders/change_status/1").with(jwtAdmin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(true));
    }

    @Test
    void changeCompleteStatus_notFound_returns404() throws Exception {
        when(orderService.changeCompleteStatus(1L))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND));
        mockMvc.perform(put("/api/orders/change_status/1").with(jwtAdmin))
                .andExpect(status().isNotFound());
    }

    @Test
    void changeCompleteStatus_invalidId_returns400() throws Exception {
        mockMvc.perform(put("/api/orders/change_status/not-a-number").with(jwtAdmin))
                .andExpect(status().isBadRequest());
    }

    // =============================== updateOrderStatus ===============================
    @ParameterizedTest
    @ValueSource(strings = {"true", "false"})
    void updateOrderStatus_parametrized_returns200AndBody(String markAsSent) throws Exception {
        when(orderService.changeOrderStatus(1L, Boolean.parseBoolean(markAsSent))).thenReturn(o);
        mockMvc.perform(put("/api/orders/1/status").with(jwtAdmin)
                        .param("markAsSent", markAsSent))
                .andExpect(status().isOk());
    }

    @Test
    void updateOrderStatus_missingParam_returns400() throws Exception {
        mockMvc.perform(put("/api/orders/1/status").with(jwtAdmin))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateOrderStatus_invalidParam_returns400() throws Exception {
        mockMvc.perform(put("/api/orders/1/status").with(jwtAdmin)
                        .param("markAsSent", "notBoolean"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateOrderStatus_notFound_returns404() throws Exception {
        when(orderService.changeOrderStatus(1L, true))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND));
        mockMvc.perform(put("/api/orders/1/status").with(jwtAdmin)
                        .param("markAsSent", "true"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteOrder_returns204() throws Exception {
        mockMvc.perform(delete("/api/orders/1").with(jwtAdmin))
                .andExpect(status().isNoContent());
        verify(orderService).deleteOrder(1L);
    }

    @Test
    void deleteOrder_notFound_returns404() throws Exception {
        doThrow(new ResponseStatusException(HttpStatus.NOT_FOUND))
                .when(orderService).deleteOrder(1L);
        mockMvc.perform(delete("/api/orders/1").with(jwtAdmin))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteOrder_invalidId_returns400() throws Exception {
        mockMvc.perform(delete("/api/orders/not-a-number").with(jwtAdmin))
                .andExpect(status().isBadRequest());
    }

    @Test
    void downloadOrderPdf_returns200AndPdf() throws Exception {
        byte[] pdf = {1, 2, 3};
        when(orderService.generateOrderPdf(1L)).thenReturn(pdf);
        when(orderService.getOrderById(1L)).thenReturn(o);

        mockMvc.perform(get("/api/orders/order/1/pdf").with(jwtAdmin))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "application/pdf"))
                .andExpect(header().string("Content-Disposition", "attachment; filename=\"order_alice_" +
                        LocalDate.now().format(java.time.format.DateTimeFormatter.ISO_DATE) + ".pdf\""))
                .andExpect(content().bytes(pdf));
    }

    @Test
    void downloadOrderPdf_orderNotFound_returns404() throws Exception {
        when(orderService.getOrderById(1L))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND));
        mockMvc.perform(get("/api/orders/order/1/pdf").with(jwtAdmin))
                .andExpect(status().isNotFound());
    }

    @Test
    void downloadOrderPdf_generationError_returns500() throws Exception {
        when(orderService.getOrderById(1L)).thenReturn(o);
        when(orderService.generateOrderPdf(1L))
                .thenThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR));
        mockMvc.perform(get("/api/orders/order/1/pdf").with(jwtAdmin))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void downloadOrderPdf_invalidId_returns400() throws Exception {
        mockMvc.perform(get("/api/orders/order/not-a-number/pdf").with(jwtAdmin))
                .andExpect(status().isBadRequest());
    }
}
