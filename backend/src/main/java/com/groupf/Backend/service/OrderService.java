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

@Service
public class OrderService {


    private final ProductRepository productRepository;
    private final OrderItemService orderItemService;
    private final OrderRepository orderRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository,
                        OrderItemService orderItemService,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.orderItemService = orderItemService;
        this.productRepository = productRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional
    public List<Order> getActiveOrders() {
        return orderRepository.findAllActiveOrders()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Transactional
    public List<Order> getCompletedOrders() {
        return orderRepository.findAllCompletedOrders()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Transactional
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    public Order createOrder(Order order) {
        order.setCreationDate(LocalDate.now()); // Sätts automatiskt i databasen
        return orderRepository.save(order);
    }

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

    public Order changeCompleteStatus(Long id) {
        //kontrollera att den kan bara användas om namn och senddatum finns!
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        order.setCompleted(!order.isCompleted());
        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }


    @Transactional
    public byte[] generateOrderPdf(Long id) {
        //Hämta ordern
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order ej funnen: " + id));

        //Hämta alla orderrader för denna order
        List<OrderItem> items = orderItemService.getOrderItemsByOrderId(id);

        // Samla ihop alla unika productId
        List<Long> productIds = items.stream()
                .map(OrderItem::getProductId)
                .distinct()
                .toList();

        // Hämta samtliga Product-objekt i ETT anrop (undvik N+1)
        List<Product> products = productRepository.findAllById(productIds);

        // bygg en Map för snabba uppslag i mallen
        Map<Long, Product> productMap = products.stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        // konfigurera Thymeleaf (oförändrat)
        ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
        resolver.setPrefix("/templates/");
        resolver.setSuffix(".html");
        resolver.setTemplateMode(TemplateMode.HTML);
        resolver.setCharacterEncoding("UTF-8");
        resolver.setCacheable(false);

        SpringTemplateEngine engine = new SpringTemplateEngine();
        engine.setTemplateResolver(resolver);

        // lägg alla variabler i Context
        Context ctx = new Context(Locale.getDefault());
        ctx.setVariable("order", order);
        ctx.setVariable("items", items);
        ctx.setVariable("productMap", productMap);

        // Rendera HTML
        String html = engine.process("order_pdf", ctx);

        //  Bygg PDF
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