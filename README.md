# 7Timer CRUD Application

🌡️📝 This is a backend application designed to store maximum and minimum temperatures for a given location using the [7Timer](http://www.7timer.info/doc.php?lang=en#introduction) API. The application is built using Node.js and leverages the Express.js framework to streamline server configuration. The temperature data is stored in a PostgreSQL database hosted on AWS' RDS.

To execute scheduled functions and serve the archived records, the application is deployed on AWS' EC2 http://ec2-13-48-46-75.eu-north-1.compute.amazonaws.com:8080/.

To interact with the server, send CRUD (Create, Read, Update, Delete) requests using your preferred API development tool. Ensure that the necessary key-value pairs are included in the request body using the `x-www-form-urlencoded` encoding.

## Features

- ➕ Create: Users can add new locations by providing latitude and longitude coordinates.
- ✏️ Update: Users can update the generated slug name for a location.
- 🗑️ Delete: Users can delete a location and its related temperature records by slug name or ID.
- 🔍 Read: Users can retrieve all location records and temperature data within a date range.

## Technologies Used

- 💻 Programming Language: JavaScript
- 🌐 Framework: Node.js with Express.js
- 🗄️ Database: PostgreSQL
- ☁️ Deployment: AWS RDS and EC2
- 📦 Package Installer: NPM
- 📚 Libraries:

  - [PG-node](https://www.npmjs.com/package/pg)
  - [Transliteration.js](https://www.npmjs.com/package/transliteration)
  - [Nodemon](https://www.npmjs.com/package/nodemon)
  - [NodeFetch](https://www.npmjs.com/package/node-fetch)
  - [Prettier](https://www.npmjs.com/package/prettier)
  - [Node-cron](https://www.npmjs.com/package/node-cron)

---

## Installation

The application requires no installation and can be accessed with an API development tool at ec2-18-192-8-128.eu-central-1.compute.amazonaws.com:8080/. However, it can also be installed on a local machine by cloning the repository and executing the following scripts:
To install packages:

```
NPM install

```

To run:

```
NPM start

```

This will use Nodemon to manage the application's lifecycle.

---

## Usage

There are two main endpoints, **/api/location/** and **temperature** to perfrom the described CRUD functions:

### Locations

**Create**: Add a new location by providing a value for the **latitude** and **longitude** keys using `x-www-form-urlencoded` encoding.

> latitude: 51.906563
> longitude: 4.2728286

```
POST: /api/location/addLocation =>
Location with ID: 68 has been added.
Use slug name vlaardingen to retrieve data related to the location.

```

**Read**: Retrieve a location by ID or slug name.

> slug name: vlaardingen
> or
> ID: 68

```
GET /api/location/getLocation =>
{
  "resultId":  68,
  "resultSlugname":  "vlaardingen",
  "latitude":  51.906563,
  "longitude":  4.2728286,
  "creationDate":  "2023-05-29"
}

```

**Read**: Retrieve all location records.

```
GET /api/location/getAllLocations =>
...
{
  "id":  14,
  "slugname":  "vyborgskiy-rayon",
  "latitude":  60.2,
  "longitude":  28.36,
  "creationdate":  "2023-05-28T22:00:00.000Z"
},
{
  "id":  15,
  "slugname":  "pashskoe-selskoe-poselenie",
  "latitude":  60.2,
  "longitude":  33.36,
  "creationdate":  "2023-05-28T22:00:00.000Z"
},
...

```

**Delete**: Delete a location and its related temperature records by slug name or ID.

> slug name: vlaardingen
> or
> ID: 68

```
DELETE /api/location/deleteLocation =>
Location with ID: 68 and slug name vlaardigen has been deleted.

```

**Update**: Update old slug name with new slug name for a location.

> old slug name: nhr-lnyl
> new slug name: test

```
UPDATE /api/location/updateLocation =>
Location with slug name nhr-lnyl has been updated.
{
  id: 19,
  slugname: test,
  latitude: 18.84,
  longitude: 33.65,
  creationDate: 2023-05-29
}

```

---

### Temperatures

**Read**: Retrieve all temperature records from the database.

```
GET /api/temperature/getAllTemperatures =>
...
{
  "slugname":  "mon",
  "date":  "2023-05-29",
  "min_temperature":  6,
  "max_temperature":  15
},
{
  "slugname":  "vyborgskiy-rayon",
  "date":  "2023-05-29",
  "min_temperature":  7,
  "max_temperature":  10
},
...

```

**Read**: Retrieve all temperature records within a time range by using the location's **slug name**, **start date**, and **end date**.

> slug name: mon
> start date: 2023-05-28
> end date: 2023-06-01

```
GET /api/temperature/getTemperaturesWithDate =>
[
  {
    "slugname":  "mon",
    "date":  "2023-05-30",
    "min_temperature":  5,
    "max_temperature":  16
  },
  {
    "slugname":  "mon",
    "date":  "2023-05-29",
    "min_temperature":  6,
    "max_temperature":  15
  }
]

```
