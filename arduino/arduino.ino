#include <Arduino.h>
#include <U8g2lib.h>

#ifdef U8X8_HAVE_HW_SPI
#include <SPI.h>
#endif
#ifdef U8X8_HAVE_HW_I2C
#include <Wire.h>
#endif

// Arduino Uno SCL = A5, SDA = A4
U8G2_SSD1306_128X64_NONAME_F_SW_I2C u8g2(U8G2_R0, /* clock=*/ SCL, /* data=*/ SDA, /* reset=*/ U8X8_PIN_NONE);

const int DISPLAY_WIDTH = 128;
const int DISPLAY_HEIGHT = 64;

void setup() {
  Serial.begin(9600);
  u8g2.begin();
  u8g2.enableUTF8Print();
  u8g2.setFontDirection(0);
}

/*
   getMaxCharWidth();
   getMaxCharHeight();
   getStrWidth(str); in pixels
   setPowerSave(1 | 0);

*/

void buff(int x, int y, String s) {
  u8g2.setCursor(x, y);
  u8g2.print(s);
}

int count = 0;
bool isTransferEnd = true;

void loop() {
  if (Serial.available() > 0) {
    isTransferEnd = false;
    String message = Serial.readStringUntil('\0');
    switch (count) {
      case 0: // Time
        u8g2.setFont(u8g2_font_tom_thumb_4x6_tr);
        buff(DISPLAY_WIDTH - u8g2.getStrWidth(message.c_str()), u8g2.getMaxCharHeight(), message);
        break;
      case 1: // Author
        u8g2.setFont(u8g2_font_mercutio_basic_nbp_t_all);
        buff(0, u8g2.getMaxCharHeight() - 3, message);
        break;
      case 2: // Page
        u8g2.setFont(u8g2_font_tom_thumb_4x6_tr);
        buff(DISPLAY_WIDTH - u8g2.getStrWidth(message.c_str()), (u8g2.getMaxCharHeight() + 1) * 2, message);
        break;
      default: // Content
        u8g2.setFont(u8g2_font_mercutio_basic_nbp_t_all); //u8g2_font_profont12_tr
        buff(0, 12 + (u8g2.getMaxCharHeight()) * (count - 2), message);
        break;
    }
    count++;
  } else {
    if (!isTransferEnd) {
      isTransferEnd = true;
      u8g2.sendBuffer();
      u8g2.clearBuffer();
      count = 0;
    }
  }
  
  delay(1);
}
