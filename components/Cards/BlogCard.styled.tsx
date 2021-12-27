import styled from "@emotion/styled"
import { calcRem } from '../../utils/helpers/css'

<StyledKicker>
<StyledTimestamp />
<StyledTitle />
</StyledKicker>
<StyledImage />
<StyledTextCollection>
<StyledText />
<StyledSocials />
</StyledTextCollection>

export const StyledBlogCollection = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: calcRem(5)
})

export const StyledKicker = styled('div')({
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: calcRem(5)
})

export const StyledTimestamp = styled('span')({
    'fontSize'
})