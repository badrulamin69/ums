package com.smartuniversity.payment.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.HashMap;
import java.util.Map;

@Service
public class SslCommerzService {

    private static final Logger log = LoggerFactory.getLogger(SslCommerzService.class);

    @Value("${sslcommerz.store-id:}")
    private String storeId;

    @Value("${sslcommerz.store-password:}")
    private String storePassword;

    @Value("${sslcommerz.sandbox:true}")
    private boolean sandbox;

    @Value("${app.backend-url:http://localhost:8085}")
    private String backendUrl;

    private final RestTemplate restTemplate;

    public SslCommerzService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map<String, Object> initiatePayment(String transactionId, String amount, String currency,
                                                String customerName, String customerEmail, String customerPhone) {
        String url = sandbox
                ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
                : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

        Map<String, Object> params = new HashMap<>();
        params.put("store_id", storeId);
        params.put("store_passwd", storePassword);
        params.put("total_amount", amount);
        params.put("currency", currency);
        params.put("tran_id", transactionId);
        params.put("success_url", backendUrl + "/api/payments/callback?transactionId=" + transactionId + "&status=SUCCESS");
        params.put("fail_url", backendUrl + "/api/payments/callback?transactionId=" + transactionId + "&status=FAILED");
        params.put("cancel_url", backendUrl + "/api/payments/callback?transactionId=" + transactionId + "&status=CANCELLED");
        params.put("emi_option", "0");
        params.put("cus_name", customerName);
        params.put("cus_email", customerEmail);
        params.put("cus_phone", customerPhone);
        params.put("shipping_method", "NO");
        params.put("product_name", "University Payment");
        params.put("product_category", "Education");
        params.put("product_profile", "noncategory");

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            for (Map.Entry<String, Object> entry : params.entrySet()) {
                formData.add(entry.getKey(), String.valueOf(entry.getValue()));
            }

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            if (response.getBody() != null) {
                log.info("SSLCommerz v4 response for {}: status={}, hasGatewayUrl={}",
                        transactionId,
                        response.getBody().get("status"),
                        response.getBody().get("redirectGatewayURL") != null);
                return response.getBody();
            }
        } catch (Exception e) {
            log.error("SSLCommerz initiation failed for {}: {}", transactionId, e.getMessage());
        }

        Map<String, Object> fallback = new HashMap<>();
        fallback.put("status", "FAILED");
        fallback.put("message", "Payment gateway unreachable");
        return fallback;
    }

    public boolean validateSignature(String valId, String amount, String currency) {
        String url = sandbox
                ? "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?v=1"
                : "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php?v=1";

        Map<String, String> params = new HashMap<>();
        params.put("val_id", valId);
        params.put("store_id", storeId);
        params.put("store_passwd", storePassword);
        params.put("amount", amount);
        params.put("currency", currency);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            for (Map.Entry<String, String> entry : params.entrySet()) {
                formData.add(entry.getKey(), entry.getValue());
            }

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            if (response.getBody() != null) {
                return "VALID".equals(response.getBody().get("status"));
            }
        } catch (Exception e) {
            log.error("SSLCommerz validation failed: {}", e.getMessage());
        }
        return false;
    }
}
