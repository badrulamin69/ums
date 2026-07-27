package com.smartuniversity.common.util;

import org.bytedeco.opencv.opencv_core.*;
import org.bytedeco.opencv.opencv_dnn.Net;
import org.bytedeco.javacpp.indexer.FloatIndexer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.FloatBuffer;

import static org.bytedeco.opencv.global.opencv_dnn.*;
import static org.bytedeco.opencv.global.opencv_imgproc.*;
import static org.bytedeco.opencv.global.opencv_imgcodecs.*;

@Component
public class FaceEncoder {

    @Value("${face.encoding.model.path:openface_nn4.small2.v1.t7}")
    private String modelPath;

    private Net faceNet;

    private static final int FACE_WIDTH = 96;
    private static final int FACE_HEIGHT = 96;
    private static final int ENCODING_SIZE = 128;

    @PostConstruct
    public void init() throws IOException {
        ClassPathResource resource = new ClassPathResource(modelPath);
        faceNet = readNetFromTorch(resource.getFile().getAbsolutePath());
    }

    public float[] encodeFace(Mat face) {
        Mat resized = new Mat();
        resize(face, resized, new Size(FACE_WIDTH, FACE_HEIGHT));

        Mat blob = blobFromImage(resized, 1.0 / 255.0,
                new Size(FACE_WIDTH, FACE_HEIGHT),
                new Scalar(0, 0, 0, 0),
                false, false, 5);

        faceNet.setInput(blob);
        Mat descriptors = faceNet.forward();

        float[] encoding = new float[ENCODING_SIZE];
        FloatIndexer indexer = descriptors.createIndexer();
        for (int i = 0; i < ENCODING_SIZE; i++) {
            encoding[i] = indexer.get(i);
        }

        resized.close();
        blob.close();
        descriptors.close();

        return encoding;
    }

    public byte[] encodeToBytes(float[] encoding) {
        ByteBuffer buffer = ByteBuffer.allocate(encoding.length * 4);
        FloatBuffer floatBuffer = buffer.asFloatBuffer();
        floatBuffer.put(encoding);
        return buffer.array();
    }

    public float[] decodeFromBytes(byte[] bytes) {
        ByteBuffer buffer = ByteBuffer.wrap(bytes);
        FloatBuffer floatBuffer = buffer.asFloatBuffer();
        float[] encoding = new float[ENCODING_SIZE];
        floatBuffer.get(encoding);
        return encoding;
    }
}
