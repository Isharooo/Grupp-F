package com.groupf.Backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.groupf.Backend.model.OrderItem;
import com.groupf.Backend.service.OrderItemService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderItemController.class)
class OrderItemControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper mapper;
    @MockitoBean
    OrderItemService orderItemService;

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
    void getAllOrderItems_returns200AndList() throws Exception {
        when(orderItemService.getAllOrderItems()).thenReturn(List.of(oi));

        mockMvc.perform(get("/api/orderitems"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].quantity").value(4));
    }

    @Test
    void getOrderItemsByOrderId_returns200AndList() throws Exception {
        when(orderItemService.getOrderItemsByOrderId(2L)).thenReturn(List.of(oi));

        mockMvc.perform(get("/api/orderitems/order/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void getOrderItemsByOrderIdAndProductId_returns200AndList() throws Exception {
        when(orderItemService.getOrderItemsByOrderIdAndProductId(2L,3L))
                .thenReturn(List.of(oi));

        mockMvc.perform(get("/api/orderitems")
                        .param("orderId","2")
                        .param("productId","3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].productId").value(3));
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
    void updateOrderItem_returns200AndBody() throws Exception {
        when(orderItemService.addOrderItem(any(OrderItem.class))).thenReturn(oi);

        mockMvc.perform(put("/api/orderitems/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(oi)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void deleteOrderItem_returns204() throws Exception {
        mockMvc.perform(delete("/api/orderitems/1"))
                .andExpect(status().isNoContent());
        verify(orderItemService).deleteOrderItem(1L);
    }
}
