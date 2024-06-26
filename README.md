## Traquer

Traquer is a passionate bird that helps you watch over your files while you go about your daily business. Traquer is a location file tracking system. A simulation of manual file movement to electronic file monitoring


## Technical stack:
- Back-end: Node JS
- Front-end: React JS 17
- Database: Mongo DB

- Configuration in `.env`
    - MONGO_HOSTNAME=localhost
    - MONGO_PORT=27017

    - MAILTRAP_USERNAME=
    - MAILTRAP_PASSWORD=
    - EMAIL_SENDER=

    - NODE_ENV=development

    - SMS_USERNAME=
    - SMS_PASSWORD=
    - SMS_SENDER=

    - FILE_NUMBER_PREFIX=

    - SLA_HOURS=48

### Install required packages for back-end:

```sh
yarn install
```

### Serve the backend:

```sh
yarn start
```

### Install required packages for front-end in a different terminal:

```sh
cd frontend && yarn install
```

### Serving the frontend:

```sh
 yarn start
```

### Open browser and Seed required uer role data in db:
```sh
URL_PATH/v1/seed/user-role
```
### Open postman and create root user:
```sh
POST::  URL_PATH/v1/user/add
```
```sh
{
     "firstName": "",
      "lastName" : "",
      "email": "",
      "telephone": 23480******,
      "dob": "2021/01/12",
      "gender": "M",
      "designation": "Super Administrator",
      "isSuper" : true,
      "userRole": userRole_id
}
```

### Refer to API documentation on how to activate account
-   [API Documentation](https://documenter.getpostman.com/view/2203927/TWDdjtsb)

## Deployment
- The assumption is that the Ubuntu server has been created and you have ssh into the server.
- [Install Node JS on the server](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04)

- [If git does not exist, install git](https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-18-04-quickstart)

- Install PM2 on ubuntu
```sh
sudo npm install pm2 -g
```
- [Install Mongo DB on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-18-04)

- [Install Yarn](https://linuxize.com/post/how-to-install-yarn-on-ubuntu-18-04/)

- Clone git repo
```sh
git clone ${REPO_URL}
```
```sh
cd web
```

```sh
yarn install
```
```sh
yarn build
```

```sh
cd frontend
```
```sh
yarn install
```

```sh
yarn build
```

- Start the backend service
```sh
sudo pm2 start npm --name "app_name" -- start
```

- Configure NGINX to serve the Node.js API and React front-end. [ Example](https://dev.to/asim_ansari7/deploy-a-react-node-app-to-production-on-aws-2gdf)

```sh
sudo apt-get install -y nginx
```

- head to the following directory
```sh
cd /etc/nginx/sites-available/
```

- Delete the default file and create a new one with the following code:
```sh
server{
    listen      80 default_server;
    listen      [::]:80 default_server;
    server_name localhost;
    # react app frontend files
    location    / {
                root /home/ubuntu/web/frontend/build;
                index index.html;
                try_files $uri /index.html;
                expires 30d;
    }

    # node api reverse proxy
    location    /v1 {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-NginX-Proxy true;
                proxy_pass http://localhost:4000;
                proxy_set_header Host $http_host;
                proxy_cache_bypass $http_upgrade;
                proxy_redirect off;
    }
}
```

- Save the file and restart nginx using
```sh
sudo systemctl restart nginx
```
