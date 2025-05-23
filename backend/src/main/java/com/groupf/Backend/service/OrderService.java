package com.groupf.Backend.service;

import com.groupf.Backend.model.Order;
import com.groupf.Backend.model.OrderItem;
import com.groupf.Backend.model.Product;
import com.groupf.Backend.repository.OrderRepository;
import com.groupf.Backend.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

import java.io.ByteArrayOutputStream;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

/**
 * Service class that handles operations related to customer orders.
 * Supports creating, updating, retrieving, deleting, and exporting orders to PDF.
 */
@Service
public class OrderService {

    private final ProductRepository productRepository;
    private final OrderItemService orderItemService;
    private final OrderRepository orderRepository;

    /**
     * Constructs a new OrderService with the required dependencies.
     *
     * @param orderRepository the repository used for storing and retrieving orders
     * @param orderItemService the service used to manage items in an order
     * @param productRepository the repository for product data
     */
    @Autowired
    public OrderService(OrderRepository orderRepository,
                        OrderItemService orderItemService,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.orderItemService = orderItemService;
        this.productRepository = productRepository;
    }

    /**
     * Retrieves a list of all orders in the system.
     *
     * @return list of all Order objects
     */
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // För vanliga användare - behöver implementeras
    public List<Order> getOrdersByUserId(String userId) {
        return orderRepository.findByCreatedBy(userId);
    }


    /**
     * Retrieves a specific order by its ID.
     *
     * @param id the ID of the order to retrieve
     * @return the matching Order object
     * @throws ResponseStatusException if the order is not found
     */
    @Transactional
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    /**
     * Creates a new order with the current date as creation date.
     *
     * @param order the order to be created
     * @return the saved Order object
     */
    public Order createOrder(Order order, String userId) {
        order.setCreationDate(LocalDate.now());
        order.setCreatedBy(userId);
        return orderRepository.save(order);
    }

    /**
     * Changes the completion status of an order.
     * If marking as sent, the send date is set to today.
     *
     * @param id the ID of the order
     * @param markAsSent true to mark as sent and completed, false to unmark
     * @return the updated Order object
     * @throws ResponseStatusException if the order is not found or if send date is missing
     */
    public Order changeOrderStatus(Long id, boolean markAsSent) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (markAsSent) {
            if (order.getSendDate()==null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
            order.setCompleted(true);
            order.setSendDate(LocalDate.now());
        }
        else {
            order.setCompleted(false);
        }
        return orderRepository.save(order);
    }

    /**
     * Updates an existing order's customer name and planned send date.
     *
     * @param id the ID of the order to update
     * @param customerName the new customer name
     * @param plannedSendDate the new planned send date
     * @return the updated Order object
     * @throws ResponseStatusException if the order is not found
     */
    public Order updateOrder(Long id, String customerName, LocalDate plannedSendDate) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (customerName != null && !customerName.isEmpty()) {
            order.setCustomerName(customerName);
        }

        if (plannedSendDate != null) {
            order.setSendDate(plannedSendDate);
        }

        return orderRepository.save(order);
    }

    /**
     * Toggles the 'completed' status of an order.
     *
     * @param id the ID of the order
     * @return the updated Order object
     * @throws ResponseStatusException if the order is not found
     */
    public Order changeCompleteStatus(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        order.setCompleted(!order.isCompleted());
        return orderRepository.save(order);
    }

    /**
     * Deletes an order from the database.
     *
     * @param id the ID of the order to delete
     */
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    /**
     * Generates a PDF file representing a specific order.
     * The PDF includes order details and product information.
     *
     * @param id the ID of the order to export
     * @return byte array representing the PDF file
     * @throws ResponseStatusException if the order is not found or PDF generation fails
     */
    @Transactional
    public byte[] generateOrderPdf(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order ej funnen: " + id));

        List<OrderItem> items = orderItemService.getOrderItemsByOrderId(id);

        List<Long> productIds = items.stream()
                .map(OrderItem::getProductId)
                .distinct()
                .toList();

        List<Product> products = productRepository.findAllById(productIds);

        Map<Long, Product> productMap = products.stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
        resolver.setPrefix("/templates/");
        resolver.setSuffix(".html");
        resolver.setTemplateMode(TemplateMode.HTML);
        resolver.setCharacterEncoding("UTF-8");
        resolver.setCacheable(false);

        SpringTemplateEngine engine = new SpringTemplateEngine();
        engine.setTemplateResolver(resolver);

        Context ctx = new Context(Locale.getDefault());
        ctx.setVariable("order", order);
        ctx.setVariable("items", items);
        ctx.setVariable("productMap", productMap);

        String html = engine.process("order_pdf", ctx);

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.withHtmlContent(html, null);
            builder.toStream(baos);
            builder.run();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Kunde inte generera PDF för order " + id, e);
        }
    }
}