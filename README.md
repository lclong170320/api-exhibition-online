# COMPAON SERVICE LAYER

## FOR DEVELOP ENVIRONMENT

### Required

- OS: macOS, linux, ubuntu, windows
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) or [Ubuntu Docker engine](https://docs.docker.com/engine/install/ubuntu/)

### Start/Stop Project locally

- Start Project with command `docker-compose up -d`
- Stop Project with command `docker-compose down`
- Clear image with command
    ```
    docker stop $(docker ps -a -q)
    docker rm $(docker ps -a -q)
    ```
- Then, access http://localhost:3000/ to check the result.


### Setup .env local
```
NODE_ENV=development

DATABASE_HOST=mysql
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=
DATABASE_CONNECTION_TIMEOUT=200000
DATABASE_CONNECTION_LIMIT=50

DATABASE_NAME_EXHIBITION=compaon_exhibition_dev
DATABASE_NAME_MEDIA=compaon_media_dev
DATABASE_NAME_ENTERPRISE=compaon_enterprise_dev

HTTP_TIMEOUT=5000
HTTP_MAX_REDIRECTS=5

CLIENT_HOST=https://compaon/

ERROR_LOG_FILE=D:\Dalavina\compaon-service\logs\error.log
ACCESS_LOG_FILE=D:\Dalavina\compaon-service\logs\access.log

LOG_LEVEL=info
```

## API Document
Access https://dalavina.stoplight.io/docs/compaon/branches/main
