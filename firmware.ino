// This #include statement was automatically added by the Spark IDE.
#include "OneWire/OneWire.h"

OneWire TEMPERATURE_SENSOR = OneWire(D0);
uint8_t rom[8];
uint8_t resp[9];

int RELAY = D1;

int relayState = 0;
float currentTemperature = 0.0;


int setRelay(String params){
  int newRelayState = params.charAt(0) - '0';

  relayState = newRelayState;
  digitalWrite(RELAY, relayState);

  return 1;
}


void setup()
{
  Spark.variable("temperature", &currentTemperature, STRING);
  Spark.function("set-relay", setRelay);
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

  int16_t intTemp   = ((MSB << 8) | LSB); //using two's compliment 16-bit
  float celsius     = ((double)intTemp)/16.0;
  float fahrenheit  = (( celsius*9.0)/5.0+32.0);

  // publish the relay state and current temperature
  char publishString[64];
  sprintf(publishString, "{ \"relayState\": \"%u\", \"celsius\": %e, , \"fahrenheit\": %e }", relayState, celsius, fahrenheit);
  Spark.publish("temperature", publishString);

  // make available to the spark variable
  currentTemperature = fahrenheit;

  // add a delay to prevent rate limiting
  delay(5000);
}
