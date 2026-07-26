package com.smartuniversity;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class SmartUniversityApplicationTests {

    @Test
    void applicationClassExists() {
        assertDoesNotThrow(() -> Class.forName("com.smartuniversity.SmartUniversityApplication"));
    }
}
