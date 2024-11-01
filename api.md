
# /auth

## POST /auth/signup

## POST /auth/signin

## POST /auth/signout

# /feed

## GET /feed

```json
{
 "posts": [{...}],
}
```

# /post

## POST /post

```json
{
    "image": "string, resource url",
    "body": "string",
}
```

## DELETE /post

```json
{
    "image": "string, resource url",
    "body": "string",
}
```

# /profile

## GET /profile

Response

```json
{
 "name": "string",
 "bio": "string",
 "image": "string, resourc url",
 "contact": "string",
 "posts": [{...}],
 "gallery": [{...}],
}
```

## GET /profile/{userid}

Response

```json
{
 "name": "string",
 "bio": "string",
 "image": "string, resourc url",
 "contact": "string",
 "posts": [{...}],
 "gallery": [{...}],
}
```

## POST /profile/update

Request

```json
{
 "name?": "string",
 "bio?": "string",
 "image?": "string, resourc url",
 "contact?": "string",
}
```

# /network

## POST /network/connect

Request

```json
{
 "userId": "string, uuid"
}
```

## POST /network/disconnect

Request

```json
{
 "userId": "string, uuid"
}
```
