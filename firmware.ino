int TEMPERATURE_SENSOR = A0;
int RELAY = D0;
int relayState = 0;
int currentTemperature = 0;


int setRelay(String params){
  int newRelayState = params.charAt(0) - '0';

  relayState = newRelayState;
  digitalWrite(RELAY, relayState);

  return 1;
}


void setup()
{
  Spark.variable("temperature", &currentTemperature, INT);
  Spark.function("set-relay", setRelay);
}


void loop()
{
  currentTemperature = analogRead(TEMPERATURE_SENSOR);

  // publish the relay state and current temperature
  char publishString[64];
  sprintf(publishString, "{ \"relayState\": \"%u\", \"temperature\": %u }", relayState, currentTemperature);
  Spark.publish("temperature", publishString);

  // add a delay to prevent rate limiting
  delay(5000);
}
