package com.groupf.Backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.groupf.Backend.model.OrderItem;
import com.groupf.Backend.service.OrderItemService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderItemController.class)
@AutoConfigureMockMvc(addFilters = false)
class OrderItemControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper mapper;
    @MockitoBean OrderItemService orderItemService;

    private OrderItem oi;

    @BeforeEach
    void setUp() {
        oi = new OrderItem();
        oi.setId(1L);
        oi.setOrderId(2L);
        oi.setProductId(3L);
        oi.setQuantity(4L);
    }

    @Test
    void getOrderItems_noParams_returns200AndAllItems() throws Exception {
        when(orderItemService.getAllOrderItems()).thenReturn(List.of(oi));
        mockMvc.perform(get("/api/orderitems"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].quantity").value(4));
    }

    @Test
    void getOrderItems_withOrderId_returns200AndFilteredItems() throws Exception {
        when(orderItemService.getOrderItemsByOrderId(2L)).thenReturn(List.of(oi));
        mockMvc.perform(get("/api/orderitems?orderId=2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].orderId").value(2));
    }

    @Test
    void getOrderItems_withOrderIdAndProductId_returns200AndFilteredItems() throws Exception {
        when(orderItemService.getOrderItemsByOrderIdAndProductId(2L, 3L)).thenReturn(List.of(oi));
        mockMvc.perform(get("/api/orderitems?orderId=2&productId=3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].productId").value(3));
    }

    @Test
    void getOrderItems_serviceError_returns500() throws Exception {
        when(orderItemService.getAllOrderItems())
                .thenThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Database error"));
        mockMvc.perform(get("/api/orderitems"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void getOrderItemsByOrderId_returns200AndList() throws Exception {
        when(orderItemService.getOrderItemsByOrderId(2L)).thenReturn(List.of(oi));
        mockMvc.perform(get("/api/orderitems/order/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void getOrderItemsByOrderId_empty_returns200AndEmptyList() throws Exception {
        when(orderItemService.getOrderItemsByOrderId(2L)).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/orderitems/order/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void getOrderItemsByOrderId_invalidId_returns400() throws Exception {
        mockMvc.perform(get("/api/orderitems/order/not-a-number"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getOrderItemsByOrderId_notFound_returns404() throws Exception {
        when(orderItemService.getOrderItemsByOrderId(2L))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        mockMvc.perform(get("/api/orderitems/order/2"))
                .andExpect(status().isNotFound());
    }

    @Test
    void addOrderItem_returns201AndBody() throws Exception {
        when(orderItemService.addOrderItem(any(OrderItem.class))).thenReturn(oi);
        mockMvc.perform(post("/api/orderitems")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(oi)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orderId").value(2));
    }

    @Test
    void addOrderItem_invalidJson_returns400() throws Exception {
        mockMvc.perform(post("/api/orderitems")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("invalid-json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void addOrderItem_serviceError_returns500() throws Exception {
        when(orderItemService.addOrderItem(any(OrderItem.class)))
                .thenThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Service error"));
        mockMvc.perform(post("/api/orderitems")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(oi)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void updateOrderItem_returns200AndBody() throws Exception {
        oi.setQuantity(10L);
        when(orderItemService.addOrderItem(any(OrderItem.class))).thenReturn(oi);
        mockMvc.perform(put("/api/orderitems/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(oi)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(10));
    }


    @Test
    void updateOrderItem_invalidId_returns400() throws Exception {
        mockMvc.perform(put("/api/orderitems/not-a-number")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(oi)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateOrderItem_serviceError_returns500() throws Exception {
        when(orderItemService.addOrderItem(any(OrderItem.class)))
                .thenThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Update failed"));
        mockMvc.perform(put("/api/orderitems/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(oi)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void deleteOrderItem_returns204() throws Exception {
        mockMvc.perform(delete("/api/orderitems/1"))
                .andExpect(status().isNoContent());
        verify(orderItemService).deleteOrderItem(1L);
    }

    @Test
    void deleteOrderItem_notFound_returns404() throws Exception {
        doThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "OrderItem not found"))
                .when(orderItemService).deleteOrderItem(1L);
        mockMvc.perform(delete("/api/orderitems/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteOrderItem_invalidId_returns400() throws Exception {
        mockMvc.perform(delete("/api/orderitems/not-a-number"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteOrderItem_serviceError_returns500() throws Exception {
        doThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Deletion failed"))
                .when(orderItemService).deleteOrderItem(1L);
        mockMvc.perform(delete("/api/orderitems/1"))
                .andExpect(status().isInternalServerError());
    }
}