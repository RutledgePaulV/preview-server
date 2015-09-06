## preview-server

Preview Server is a dockerized webapp that can be run in order to provide an API to get thumbnail previews
of publicly available website links. It is intended to be run in order to support usages of
[preview.js](https://github.com/rutledgepaulv/preview.js)


### usage
```bash
docker run -d -p 80:3000 rutledgepaulv/preview-server
```


### get a thumbnail link
```
curl -X GET http://<your-server-that-preview-server-is-running-on>?url=www.google.com

# returns JSON
{uri: "1123412-234234-234234-234-23.png"}
```

