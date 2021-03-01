## Traquer

Traquer is a passionate bird that helps you watch over your files while you go about your daily business. Traquer is a location file tracking system. A simulation of manual file movement to electronic file monitoring

-   [Traquer Staging URL](http://ec2-3-15-39-122.us-east-2.compute.amazonaws.com/login)

## Technical stack:
- Back-end: Node JS
- Front-end: React JS 17
- Database: Mongo DB

- Configuration in `.env`
    - MONGO_HOSTNAME=localhost
    - MONGO_PORT=27017

    - MAILTRAP_USERNAME=ba4a71919cb1e7
    - MAILTRAP_PASSWORD=c257ebc8ef7cab
    - EMAIL_SENDER=info@apexapps.net

    - NODE_ENV=development

    - SMS_USERNAME=apx-ftsa
    - SMS_PASSWORD=Fts@2021
    - SMS_SENDER=Traquer

    - FILE_NUMBER_PREFIX=OYSG

    - SLA_HOURS=48

### Install required packages for back-end:

```sh
yarn install
```

### Install required packages for front-end in a different terminal:

```sh
yarn start
```

### Open browser and Seed required uer role data in db:
```sh
URL_PATH/seed/user-role
```

### Serving the frontend:

```sh
cd frontend && yarn start
```
### Open postman and create root user:
```sh
POST::  URL_PATH/user/add
```
```sh
{
     "firstName": "Super",
      "lastName" : "Admin",
      "email": "super@admin.com",
      "telephone": 23480******,
      "dob": "2021/01/12",
      "gender": "M",
      "designation": "Super Administrator",
      "isSuper" : true
}
```

### Refer to API documentation on how to activate account

## Deployment


-   [API Documentation](http://ec2-3-15-39-122.us-east-2.compute.amazonaws.com/login)

 
