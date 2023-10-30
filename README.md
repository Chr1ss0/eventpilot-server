# EventPilot (Backend🤖)

**Backend** part of the final-project of the SuperCode Bootcamp.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Express](https://img.shields.io/badge/Mongoose-000000?style=for-the-badge&logo=mongoose&logoColor=white)

## Table of Contents

- [Team Members](#team-members)
- [Description](#description)
- [Related](#related-)
  - [Frontend](#frontend-of-eventpilot-)
  - [Fake-Helper](#little-programm-to-fake-users-and-events)
- [Routes](#routes)

### Team Members:

[Matthias](https://github.com/Matthew7991)
[Jacub](https://github.com/FutureOneX)
[Daniel](https://github.com/DanielKirchenbauer)

### Involved in Backend:
[Chris](https://github.com/Chr1ss0))

### Description

## Express Server with Mongoose in TypeScript

This Express server, developed using TypeScript and integrated with Mongoose, serves as a robust and efficient platform for handling geographical data. One of its prominent features is its integration with a Geo API, allowing it to effortlessly convert zip codes into precise geo data. This functionality empowers location-based services and provides enhanced geographical context to your application.

Additionally, to ensure the integrity and coherence of the MongoDB database, a custom data generation program has been implemented. This program creates fake user, organizer, and event data, facilitating thorough testing and seamless integration with the server.

The server excels in data manipulation with sorting, searching, and filtering functions. It streamlines data retrieval and presentation, optimizing user experiences. Its robust error management ensures that issues are gracefully handled, offering a smooth and secure user interaction.

In summary, this Express server, backed by Mongoose and TypeScript, is a dynamic and versatile platform designed to provide extensive support for geographical data, efficient data management, and comprehensive error handling, making it a valuable tool for a wide range of applications.

## Related 🖇️

_Some sources and bonuses content-related and required for the full project._

### Frontend of EventPilot 👾

[GitHub-Repo Frontend](https://github.com/Chr1ss0/eventpilot-frontend)

_a gitHub Repo for the Frontend of the Project._

### Little Programm to fake Users and Events

[GitHub-Repo FakeData](https://github.com/Chr1ss0/eventpilot-fakeHelper)

_A gitHub Repo for the Fakerhelper-Programm of the Project._

## Routes

### Encrypt-Routes

```
api/auth/login    :POST Login into Account
api/auth/register :POST Register a new Account
```

### User-Routes

```
api/user/validate       :GET validate Token
api/user/data           :GET own User with token
api/user/single/:userId :GET specific User with UserID
api/user/logout         :GET remove Token
api/user/watchList      :GET user specific Bookmarked and booked Events

api/user/review              :POST Review
api/user/bookmark/:event     :POST Bookmark event with EventId
api/user/follow/:followingId :POST Follow a User with FollowId

api/user/edit PUT: Edit User
```

### Event-Routes

```
api/event/all'          :GET all Events (queries)
api/event/single/:event :GET single Event with EventId
api/event/filtered      :GET Filtered Events with queries

api/event/create           :POST create Event
api/events/register/:event :POST Book Event with EventId
```

### Utility-Routes

```
api/utility/location/:zipCode :GET Location Data with ZipCode
```
