# Vehicles

The /Vehicles endpoint returns details about vehicles on a given route, including their current location and speed.

## The Request

GET /Route/{Routes.ID}/Vehicles

## Example response

```json
[
  {
    "ID": 5694,
    "APCPercentage": 8,
    "RouteId": 4529,
    "PatternId": 20556,
    "Name": "1112",
    "HasAPC": true,
    "IconPrefix": "",
    "DoorStatus": 0,
    "Latitude": 42.024983565182005,
    "Longitude": -93.6555908726426,
    "Coordinate": { "Latitude": 42.024983565182005, "Longitude": -93.6555908726426 },
    "Speed": 20,
    "Heading": "N",
    "Updated": "10:28:52P",
    "UpdatedAgo": "0s ago"
  }
]
```
