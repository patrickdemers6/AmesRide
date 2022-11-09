# Arrivals

## The Request

GET /Stop/{Stop.RtpiNumber}/Arrivals

## Example Response

```json
[
  {
    "RouteID": 20556,
    "Arrivals": [
      {
        "RouteID": 20556,
        "StopID": 5102620,
        "VehicleID": 5744,
        "StopId": 5102620,
        "VehicleId": 5744,
        "ArriveTime": "11:19 PM",
        "RouteId": 20556,
        "Direction": 0,
        "SchedulePrediction": false,
        "IsLayover": false,
        "Rules": [],
        "ScheduledTime": null,
        "SecondsToArrival": 1850.0924452,
        "IsLastStop": false,
        "OnBreak": false,
        "ScheduledArriveTime": null,
        "ScheduledMinutes": 0,
        "TripId": 3675491,
        "BusName": "189",
        "VehicleName": "189",
        "RouteName": "1 Mall via Hospital",
        "Minutes": 31,
        "Time": "31"
      }
    ]
  }
]
```
