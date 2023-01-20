import { Publication } from '@generated/types'
import Script from 'next/script'

interface props {
    publication: Publication
}

const Post = ({ publication }: props) => {
    // const profilePicture = publication.profile?.picture?.__typename === 'MediaSet' ? publication.profile?.picture?.original?.url : publication.profile?.picture?.

    return (
        <div>
            <span id="lens-embed" data-post-id={publication?.id} />
            <Script src="https://embed.withlens.app/script.js" />
        </div>
    )
}

export default Post