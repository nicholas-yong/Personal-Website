### Description

This forms the entirety of the backend (DB) part of my website. It stores the blog entries (for now) and communicates with the frontend via the use of the blog-service-api.

### Table Planning

HashKey = BlogID (likely a UUID)
RangeKey = (I assume this is similar to the idea of a SortKey) - Blog#ArticleNumber#PublicationDate

What kind of information do we even want to store for a blogItem?

Remember that the:
HashKey = Partition Key
Range Key = Sort Key
