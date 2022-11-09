# Directions

The /Directions endpoint returns the stops on a given route.

## Notes

The RouteID is used when using the Stops endpoint.

## The Request

/Route/{Route.ID}/Directions/

## Example Response

```json
[
  {
    "IsSegment": true,
    "RouteID": 20556,
    "ID": 4529,
    "Name": "1 Mall via Hospital",
    "Directionality": "Mall via Hospital",
    "Stops": [
      {
        "ID": 5102598,
        "Image": "stop_sign_medium.gif",
        "Latitude": 42.012254,
        "Longitude": -93.671501,
        "Name": "Ames Middle School",
        "RtpiNumber": 3333,
        "ShowLabel": false,
        "ShowStopRtpiNumberLabel": false,
        "ShowVehicleName": true
      },
      {
        "ID": 5102599,
        "Image": "stop_sign_medium.gif",
        "Latitude": 42.012123,
        "Longitude": -93.675112,
        "Name": "Mortensen Road at Pinon Road Westbound",
        "RtpiNumber": 3301,
        "ShowLabel": false,
        "ShowStopRtpiNumberLabel": false,
        "ShowVehicleName": true
      },
      {
        "ID": 8197307,
        "Image": "stop_sign_medium.gif",
        "Latitude": 42.0148470149609,
        "Longitude": -93.6785942169384,
        "Name": "South Dakota Avenue at Steinbeck Street Northbound",
        "RtpiNumber": 13,
        "ShowLabel": false,
        "ShowStopRtpiNumberLabel": false,
        "ShowVehicleName": true
      }
    ]
  }
]
```
