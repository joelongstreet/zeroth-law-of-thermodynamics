// This #include statement was automatically added by the Spark IDE.
#include "OneWire/OneWire.h"

OneWire TEMPERATURE_SENSOR = OneWire(D0);
int lastTemperature = 0;
uint8_t rom[8];
uint8_t resp[9];

int MOTION_DETECTOR = D2;
int motion_detected = 0;
int RELAY = D1;
int relayState = 0;


int setRelay(String params){
  int newRelayState = params.charAt(0) - '0';

  relayState = newRelayState;
  digitalWrite(RELAY, relayState);

  return 1;
}


void setup()
{
  Spark.function("setRelay", setRelay);
  pinMode(RELAY, OUTPUT);
  pinMode(MOTION_DETECTOR, INPUT);
}


void loop()
{
  // Get the ROM address
  TEMPERATURE_SENSOR.reset();
  TEMPERATURE_SENSOR.write(0x33);
  TEMPERATURE_SENSOR.read_bytes(rom, 8);

  // Get the temp
  TEMPERATURE_SENSOR.reset();
  TEMPERATURE_SENSOR.write(0x55);
  TEMPERATURE_SENSOR.write_bytes(rom,8);
  TEMPERATURE_SENSOR.write(0x44);
  delay(10);
  TEMPERATURE_SENSOR.reset();
  TEMPERATURE_SENSOR.write(0x55);
  TEMPERATURE_SENSOR.write_bytes(rom, 8);
  TEMPERATURE_SENSOR.write(0xBE);
  TEMPERATURE_SENSOR.read_bytes(resp, 9);

  byte MSB = resp[1];
  byte LSB = resp[0];

  int16_t intTemp   = ((MSB << 8) | LSB);
  int celsius       = ((double)intTemp)/16.0;
  int fahrenheit    = ((celsius*9.0)/5.0+32.0);

  if(digitalRead(MOTION) == LOW){
    motion_detected = 1;
  }

  // publish the relay state and current temperature
  // only if changed
  if(celsius != lastTemperature){
    char publishString[64];
    sprintf(publishString, "{ \"relayState\": %u, \"celsius\": %u, \"fahrenheit\": %u, \"motionDetected\": %u }", relayState, celsius, fahrenheit, motion_detected);
    Spark.publish("update", publishString);
  }

  motion_detected = 0;
  celsius = lastTemperature;

  delay(500);
}
