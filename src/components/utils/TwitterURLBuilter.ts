export const BuildTwitterUrl = (title: string) => {
    const via = 'lensdrop'
    const url = encodeURI(`https://twitter.com/intent/tweet?text=${title}&url=https://www.lensdrop.xyz`)
    return url
}