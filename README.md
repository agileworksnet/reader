# Docker log webviewer

Simple log viewer made with nodejs. 
Logs must be stored on `storage`.

If you want to include as a service on a docker-compose:

```
version: '3.9'

services:

  api:
    container_name: log-viewer
    image: log-viewer
    restart: always
    build:
      context: ./
      dockerfile: Dockerfile
    env_file:
      - .env
    volumes:
      - ./storage:/usr/src/app/storage
    ports:
      - "3000:3000"


```

Use the `.env` file to config base url.

```
# Replace by you env url
BASE_URL_PATH=http://localhost:3000/
```