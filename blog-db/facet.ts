interface BlogMeta 
{
    author: string 
    publicationDate: number // Unix miliseconds timestamp
    tags: 
}


export interface BlogFacet {
	meta: BlogMeta
	content: BlogContent
	revision: BlogRevision
}
