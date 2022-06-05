## Available Routes

### Get Blog Information

```
Route: /blog/${id}
Method: GET
```

### Create Blog

```
Route: /blog
Method: POST
Body: {
    title: string
    mainPicture: string
    teaser: string
    content: string (HTML string)
    tags: Array["food", "coding", "stories", "general", "anime"]
}
```

### Get the first X blog items

```
Route: /blog/listing/${number}
Method: GET
```

### Update Blog Item

```
Route: /blog/${id}
Method: PUT
Body: {
    id: number
    title: string
    mainPicture: string
    teaser: string
    content: string (HTML string)
    tags: Array["food", "coding", "stories", "general", "anime"]
}
```

### Delete Blog Item

```
Route: /blog/${id}
Method: DELETE
```
