package com.smartuniversity.common.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class FaceMatcher {

    @Value("${face.match.threshold:0.6}")
    private double threshold;

    public double calculateDistance(float[] encoding1, float[] encoding2) {
        if (encoding1.length != encoding2.length) {
            throw new IllegalArgumentException("Encoding dimensions do not match");
        }

        double sum = 0.0;
        for (int i = 0; i < encoding1.length; i++) {
            double diff = encoding1[i] - encoding2[i];
            sum += diff * diff;
        }
        return Math.sqrt(sum);
    }

    public boolean isMatch(float[] encoding1, float[] encoding2) {
        return calculateDistance(encoding1, encoding2) < threshold;
    }

    public boolean isMatch(float[] encoding1, float[] encoding2, double customThreshold) {
        return calculateDistance(encoding1, encoding2) < customThreshold;
    }

    public double getThreshold() {
        return threshold;
    }
}
