#include <Arduino.h>
#include <SensirionI2cScd4x.h>
#include <Wire.h>
#include <LiquidCrystal.h>

#include "config.h"

#ifdef NO_ERROR
#undef NO_ERROR
#endif
#define NO_ERROR 0

const int rs = 13, en = 12, d4 = 9, d5 = 8, d6 = 7, d7 = 6;

SensirionI2cScd4x sensor;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);

static char errorMessage[64];
static int16_t error;

const char* dataTexts[] = {"Koncentrace CO2:", "Teplota:", "Vlhkost:"};
const char* dataTextUnits[] = {" ppm", " C", " %"};

void displayData(int dataTextNum, float value) {
  lcd.setCursor(0, 0);
  lcd.clear();
  lcd.print(dataTexts[dataTextNum]);
  lcd.setCursor(0, 1);

  if (value == (int)value) {
    lcd.print((int)value);}
  else {
    lcd.print(value);
  }

  lcd.print(dataTextUnits[dataTextNum]);

  delay(5000);
}

void sendATCommand(String command, String expectedResponse, int timeout) {
    Serial1.println(command);
    long start = millis();
    while (millis() - start < timeout) {
        while (Serial1.available()) {
            String response = Serial1.readString();
            Serial.println(response);
            if (response.indexOf(expectedResponse) != -1) return;
        }
    }
    Serial.println("Timeout waiting for response");
}

void PrintUint64(uint64_t& value) {
    Serial.begin(9600);
    lcd.begin(16, 2);
    Serial.print("0x");
    Serial.print((uint32_t)(value >> 32), HEX);
    Serial.print((uint32_t)(value & 0xFFFFFFFF), HEX);
}

void setup() {
    Serial.begin(115200);
    while (!Serial) {
        delay(100);
    }
    Serial1.begin(115200);

    sendATCommand("AT+CWJAP=\"" WIFI_SSID "\",\"" WIFI_PASSWORD "\"", "OK", 10000);
    sendATCommand("AT+CIPSTART=\"TCP\",\"" SERVER_IP "\"," + String(SERVER_PORT), "CONNECT", 5000);

    Wire.begin();
    sensor.begin(Wire, SCD41_I2C_ADDR_62);

    uint64_t serialNumber = 0;
    delay(30);
    error = sensor.wakeUp();
    if (error != NO_ERROR) {
        Serial.print("Error trying to execute wakeUp(): ");
        errorToString(error, errorMessage, sizeof errorMessage);
        Serial.println(errorMessage);
    }
    error = sensor.stopPeriodicMeasurement();
    if (error != NO_ERROR) {
        Serial.print("Error trying to execute stopPeriodicMeasurement(): ");
        errorToString(error, errorMessage, sizeof errorMessage);
        Serial.println(errorMessage);
    }
    error = sensor.reinit();
    if (error != NO_ERROR) {
        Serial.print("Error trying to execute reinit(): ");
        errorToString(error, errorMessage, sizeof errorMessage);
        Serial.println(errorMessage);
    }
    error = sensor.getSerialNumber(serialNumber);
    if (error != NO_ERROR) {
        Serial.print("Error trying to execute getSerialNumber(): ");
        errorToString(error, errorMessage, sizeof errorMessage);
        Serial.println(errorMessage);
        return;
    }
    Serial.print("serial number: 0x");
    PrintUint64(serialNumber);
    Serial.println();
}

void loop() {
    uint16_t co2Concentration = 0;
    float temperature = 0.0;
    float relativeHumidity = 0.0;
    error = sensor.wakeUp();
    if (error != NO_ERROR) {
        Serial.print("Error trying to execute wakeUp(): ");
        errorToString(error, errorMessage, sizeof errorMessage);
        Serial.println(errorMessage);
        return;
    }
    error = sensor.measureSingleShot();
    if (error != NO_ERROR) {
        Serial.print("Error trying to execute measureSingleShot(): ");
        errorToString(error, errorMessage, sizeof errorMessage);
        Serial.println(errorMessage);
        return;
    }
    error = sensor.measureAndReadSingleShot(co2Concentration, temperature, relativeHumidity);
    if (error != NO_ERROR) {
        Serial.print("Error trying to execute measureAndReadSingleShot(): ");
        errorToString(error, errorMessage, sizeof errorMessage);
        Serial.println(errorMessage);
        return;
    }
    String rawData = "{";
    rawData += "\"co2\":" + String(co2Concentration) + ",";
    rawData += "\"temperature\":" + String(temperature, 2) + ",";
    rawData += "\"humidity\":" + String(relativeHumidity, 2);
    rawData += "}";
    sendATCommand("AT+CIPSEND=" + String(rawData.length()), "OK", 1000);
    Serial1.println(rawData);

    displayData(1, temperature);
    displayData(2, relativeHumidity);
    displayData(0, co2Concentration);
}
