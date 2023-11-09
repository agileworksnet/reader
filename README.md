# Docker log webviewer

Simple log viewer made with nodejs. 
Logs must be stored on `storage`.

If you want to include as a service on a docker-compose:

```
version: '3.9'

services:

  api:
    container_name: log-viewer
    image: jmeiracorbal/log-viewer
    restart: always
    volumes:
      - ./storage:/usr/src/app/storage
    ports:
      - "3000:3000"


```