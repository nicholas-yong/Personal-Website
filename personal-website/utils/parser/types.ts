// This is probably not a good idea - but who cares.

// This interface handles all the markdown content block types
export interface MarkdownBlock
{
    kind: string
    content: ParagraphBlock
}

export interface Intentions
{
    start: number
    end: number
    // For now - let's assume that we can only have italics/bold syntax inside our paragraph blocks.
    type: 'italics' | 'bold'
}

export interface ParagraphBlock
{
    text: string
    intentions: Intentions[]
}

