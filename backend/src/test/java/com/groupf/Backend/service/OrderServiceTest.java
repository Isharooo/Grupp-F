package com.groupf.Backend.service;

import com.groupf.Backend.model.Order;
import com.groupf.Backend.model.OrderItem;
import com.groupf.Backend.model.Product;
import com.groupf.Backend.repository.OrderRepository;
import com.groupf.Backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

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
        sampleOrder = new Order();
        sampleOrder.setId(1L);
        sampleOrder.setCustomerName("Alice");
        sampleOrder.setCreationDate(LocalDate.of(2025,5,1));

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
        given(orderRepository.findAll()).willReturn(List.of(sampleOrder));
        var result = orderService.getAllOrders();
        assertEquals(1, result.size());
    }

    @Test
    void testGetOrderById_success() {
        given(orderRepository.findById(1L)).willReturn(Optional.of(sampleOrder));
        var result = orderService.getOrderById(1L);
        assertEquals("Alice", result.getCustomerName());
    }

    @Test
    void testGetActiveOrders_success() {
        var active = new Order(); active.setId(2L);
        given(orderRepository.findAllActiveOrders()).willReturn(Optional.of(List.of(active)));
        var result = orderService.getActiveOrders();
        assertEquals(1, result.size());
        assertEquals(2L, result.get(0).getId());
    }

    @Test
    void testGetCompletedOrders_success() {
        var done = new Order(); done.setId(3L);
        given(orderRepository.findAllCompletedOrders()).willReturn(Optional.of(List.of(done)));
        var result = orderService.getCompletedOrders();
        assertEquals(1, result.size());
        assertEquals(3L, result.get(0).getId());
    }

    @Test
    void testCreateOrder() {
        given(orderRepository.save(any(Order.class))).willReturn(sampleOrder);
        var result = orderService.createOrder(new Order());
        assertEquals(sampleOrder, result);
        then(orderRepository).should().save(any(Order.class));
    }

    @Test
    void testChangeOrderStatus_sent() {
        sampleOrder.setSendDate(LocalDate.now());
        given(orderRepository.findById(1L)).willReturn(Optional.of(sampleOrder));
        given(orderRepository.save(sampleOrder)).willReturn(sampleOrder);
        var result = orderService.changeOrderStatus(1L, true);
        assertTrue(result.isCompleted());
        assertEquals(LocalDate.now(), result.getSendDate());
    }

    @ParameterizedTest
    @ValueSource(booleans = { true, false })
    void testChangeCompleteStatus_toggles(boolean initial) {
        sampleOrder.setCompleted(initial);
        given(orderRepository.findById(1L)).willReturn(Optional.of(sampleOrder));
        given(orderRepository.save(any(Order.class))).willAnswer(inv -> inv.getArgument(0));
        var result = orderService.changeCompleteStatus(1L);
        assertEquals(!initial, result.isCompleted());
    }

    @ParameterizedTest
    @CsvSource({
            "null,2025-05-20",
            "Bob,null",
            "Bob,2025-06-01"
    })
    void testUpdateOrder_various(String name, String dateStr) {
        LocalDate date = "null".equals(dateStr) ? null : LocalDate.parse(dateStr);
        String newName = "null".equals(name) ? null : name;
        given(orderRepository.findById(1L)).willReturn(Optional.of(sampleOrder));
        given(orderRepository.save(any(Order.class))).willAnswer(inv -> inv.getArgument(0));

        var result = orderService.updateOrder(1L, newName, date);

        if (newName != null && !newName.isEmpty())
            assertEquals(newName, result.getCustomerName());
        else
            assertEquals("Alice", result.getCustomerName());

        if (date != null)
            assertEquals(date, result.getSendDate());
        else
            assertNull(result.getSendDate());
    }

    @Test
    void testDeleteOrder() {
        willDoNothing().given(orderRepository).deleteById(1L);
        orderService.deleteOrder(1L);
        then(orderRepository).should().deleteById(1L);
    }

    @Test
    void testGenerateOrderPdf_success_emptyItems() {
        given(orderRepository.findById(1L)).willReturn(Optional.of(sampleOrder));
        given(orderItemService.getOrderItemsByOrderId(1L)).willReturn(List.of());
        given(productRepository.findAllById(List.of())).willReturn(List.of());
        byte[] pdf = orderService.generateOrderPdf(1L);
        assertNotNull(pdf);
        assertTrue(pdf.length > 0);
    }


    @Test
    void testGetOrderById_notFound_throws() {
        given(orderRepository.findById(1L)).willReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> orderService.getOrderById(1L));
    }

    @Test
    void testGetActiveOrders_notFound_throws() {
        given(orderRepository.findAllActiveOrders()).willReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> orderService.getActiveOrders());
    }

    @Test
    void testGetCompletedOrders_notFound_throws() {
        given(orderRepository.findAllCompletedOrders()).willReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> orderService.getCompletedOrders());
    }

    @Test
    void testUpdateOrder_notFound_throws() {
        given(orderRepository.findById(1L)).willReturn(Optional.empty());
        assertThrows(ResponseStatusException.class,
                () -> orderService.updateOrder(1L, "Name", LocalDate.now()));
    }

    @Test
    void testChangeOrderStatus_idNotFound_throws() {
        given(orderRepository.findById(2L)).willReturn(Optional.empty());
        assertThrows(ResponseStatusException.class,
                () -> orderService.changeOrderStatus(2L, false));
    }

    @Test
    void testChangeOrderStatus_withoutSendDate_throwsBadRequest() {
        sampleOrder.setSendDate(null);
        given(orderRepository.findById(1L)).willReturn(Optional.of(sampleOrder));
        var ex = assertThrows(ResponseStatusException.class,
                () -> orderService.changeOrderStatus(1L, true));
        assertEquals(400, ex.getStatusCode().value());
    }

    @Test
    void testChangeCompleteStatus_idNotFound_throws() {
        given(orderRepository.findById(3L)).willReturn(Optional.empty());
        assertThrows(ResponseStatusException.class,
                () -> orderService.changeCompleteStatus(3L));
    }

    @Test
    void testGenerateOrderPdf_notFound_throws() {
        given(orderRepository.findById(1L)).willReturn(Optional.empty());
        assertThrows(ResponseStatusException.class,
                () -> orderService.generateOrderPdf(1L));
    }
}
