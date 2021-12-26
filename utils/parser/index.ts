import { readFile } from 'fs/promises'
import { MarkdownBlock, ParagraphBlock } from './types'

const parseParagraph = (text: string): ParagraphBlock =>
{
    const paragraphRegex = new RegExp('(?:\*{2}|\_{2})*\w+(?: \w+)*(?:\*{2}|\__|\*|\_)*')

    let result: 

    const result = text.split(paragraphRegex)
    
}


export const parseMarkdown = async (fileLocation: string): Array<MarkdownBlock> =>
{
    // We first need to get the content of the file that we are trying to parse
    const fileContent =  await readFile(fileLocation, {
        // Are markdown files in utf-8?
        encoding: 'utf-8'
    })

    // Go through each line in the content
    const transformedContent = fileContent.split(/[\n\r]+/g).filter((line) => line.trim())
    {
        // Now that we've split it on a per line basis
        const content: ParagraphBlock = {
            text: line
        }
    })
}