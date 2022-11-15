import { Web3Storage } from 'web3.storage'

function getAccessToken () {
  return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN
}

function makeStorageClient () {
  return new Web3Storage({ token: getAccessToken()! })
}

export const uploadToIPFS = async (data: any) => {
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })

  const files = [
    new File([blob], 'lensdrop.json')
  ]
  const client = makeStorageClient()
  const cid = await client.put(files)
  return cid
}

// export const uploadImageToIPFS = async (data: any) => {
//   return await client.add(data)
// }