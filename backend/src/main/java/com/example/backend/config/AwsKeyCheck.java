package com.example.backend.config;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "cloud.aws.credentials")
public class AwsKeyCheck {
    private String accessKey;
    private String secretKey;
    private String region;

    @PostConstruct
    public void printKeys() {
        System.out.println("ACCESS_KEY = " + accessKey);
        System.out.println("SECRET_KEY = " + secretKey);
        System.out.println("REGION = " + region);
    }

    // getter & setter 필요
    public String getAccessKey() {
        return accessKey;
    }

    public void setAccessKey(String accessKey) {
        this.accessKey = accessKey;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }


    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }
}
