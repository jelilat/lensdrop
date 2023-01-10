import { useMutation, useLazyQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import { 
    useAccount,
    useSignTypedData,
    useContractWrite,
    useNetwork,
    useSignMessage
} from 'wagmi'
import { utils } from 'ethers'
import omit from 'src/lib/omit'
import { uploadToIPFS } from 'src/lib/uploadToIPFS'
import { useAppContext } from '@components/utils/AppContext'
import { v4 as uuidv4 } from 'uuid'
import { CREATE_POST_TYPED_DATA } from '@graphql/Mutations/Post'
import { LensHubProxy } from 'src/abis/LensHubProxy'
import { Modal } from '@components/UI/Modal'
import { Button } from '@components/UI/Button'
import Cookies, { CookieAttributes } from 'js-cookie';
import { AUTHENTICATION } from '@graphql/Mutations/Authenticate';
import { GET_CHALLENGE } from '@graphql/Queries/Authenticate';
import { getHandles } from '@components/utils/winnerHandles';

type Props = {
    content: string
    variant: "primary" | "secondary" | "success" | "warning" | "super" | "danger" | undefined
    recipients: string[]
    attributes?: []
}

const Post = ({ ...props }: Props) => {
    const { profiles } = useAppContext();
    const { address, isConnected } = useAccount()
    const { chain } = useNetwork()
    const [contentURI, setContentURI] = useState<string>('');
    const [post, setPost] = useState("")
    const [openTextArea, setOpenTextArea] = useState(false)
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isListing, setIsListing] = useState<boolean>(false);

    const { signMessageAsync } = useSignMessage();
    const COOKIE_CONFIG: CookieAttributes = {
        sameSite: 'None',
        secure: true,
        expires: 360
      }

    const accessToken = Cookies.get('accessToken')

    const [getChallenge] = useLazyQuery(GET_CHALLENGE, {
       variables: { request: {
           address: address,
       }},
       fetchPolicy:'no-cache'
    })

   const [authenticate] = useMutation(AUTHENTICATION, {
        fetchPolicy:'no-cache',
        onCompleted(data){
                // console.log(data);    
          }
   })

    const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
        onError(error) {
          console.log(error?.message)
        }
      })

    const { write } = useContractWrite({
        address: '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d',
        abi: LensHubProxy,
        functionName: 'postWithSig',
        mode: 'recklesslyUnprepared',
        onError(error) {
            console.log(error?.message)
        },
        onSuccess(data: any) {
            console.log('Successfully posted', data)
            setOpenTextArea(false)
            setIsListing(false)
        }
    })

    const [createPostTypedData] = useMutation(CREATE_POST_TYPED_DATA, {
        onCompleted({
            createPostTypedData
        }) {
            // console.log(createPostTypedData)
            const { id, typedData } = createPostTypedData
                const {
                    profileId,
                    contentURI,
                    collectModule,
                    collectModuleInitData,
                    referenceModule,
                    referenceModuleInitData,
                    deadline
                } = typedData?.value

                signTypedDataAsync({
                    domain: omit(typedData?.domain, '__typename'),
                    types: omit(typedData?.types, '__typename'),
                    value: omit(typedData?.value, '__typename')
                  }).then((signature) => {
                    const { v, r, s } = utils.splitSignature(signature)
                    const sig = { v, r, s, deadline }
                    const inputStruct = {
                      profileId,
                      contentURI,
                      collectModule,
                      collectModuleInitData,
                      referenceModule,
                      referenceModuleInitData,
                      sig
                    }

                    write?.({ recklesslySetUnpreparedArgs: [inputStruct]})
                    })
                }
            })

    const shareToLens = async () => {
        if (!isConnected) {
            alert("Connect your wallet")
        } else if (profiles.length === 0) {
            alert("You don't have a lens profile")
        } else {
            setIsUploading(true)
            const path = await uploadToIPFS({
                version: '2.0.0',
                metadata_id: uuidv4(),
                description: "Lensdrop Contest Winners",
                content: post,
                locale: "en-US",
                mainContentFocus: 'TEXT_ONLY',
                name: "Lensdrop Contest Winners",
                attributes: [],
                appId: "Lensdrop"
            })
            setIsUploading(false)
            setContentURI(path)
            setIsListing(true)
            // console.log(path)
            createPostTypedData({
                variables: {
                    request: {
                        profileId: profiles[0].id,
                        contentURI: `https://${path}.ipfs.w3s.link/lensdrop.json`,
                        collectModule: {
                            revertCollectModule: true
                        },
                        referenceModule: {
                            followerOnlyReferenceModule: false
                        }
                    }
                }
            });

        }
    }

    useEffect(() => {
        setPost(props.content)
    }, [props.content])

    return (
        <div>
            {
                openTextArea ? 
                    <Modal
                        title="Share to Lens"
                        show={openTextArea}
                        onClose={() => setOpenTextArea(false)}
                    > {
                        isListing && <div className="p-3 px-4 dark:text-gray-100">
                            Go to your wallet to confirm the transaction
                        </div>
                    }
                        <textarea className="justify-center w-4/5 p-3 m-3 mx-3 rounded-lg h-32" 
                            value={post}
                            readOnly={true}
                            onChange={(e) => {
                                setPost(e.target.value)
                            }}
                        />  
                        <div>
                            {
                                accessToken ?
                                    <Button className="mx-3 mb-5"
                                        onClick={() => shareToLens()}>
                                        {
                                            !isUploading ? "Post": <div>
                                                Uploading to IPFS... 
                                            </div>
                                        }
                                    </Button>
                                : <Button className="mx-3 mb-5"
                                    onClick={()=>{
                                        setIsListing(true)
                                        getChallenge()
                                        .then(({data}) => {
                                            signMessageAsync({message: data?.challenge?.text})  
                                            .then(async (signature) => {
                                                await authenticate({
                                                    variables: {
                                                        request: {
                                                            address: address, signature
                                                        }
                                                    }
                                                })
                                                .then((res) => {
                                                    Cookies.set(
                                                        'accessToken',
                                                        res.data.authenticate.accessToken,
                                                        COOKIE_CONFIG
                                                    )
                                                    Cookies.set(
                                                        'refreshToken',
                                                        res.data.authenticate.refreshToken,
                                                        COOKIE_CONFIG
                                                    )
                                                })
                                            })
                                        })
                                        setIsListing(false)
                                    }}
                                >
                                Login 
                                </Button>
                            }
                        </div>
                    </Modal>
                    : 
                    <Button variant={props.variant}
                        onClick={async ()=> {
                            if (props.recipients?.length > 0) {
                                await getHandles(props.recipients)
                                .then((handles) => {
                                    setPost(post + ` ${handles}`)
                                })
                            }
                            setOpenTextArea(true)
                        }}>
                        Share to Lens
                    </Button>
            }
        </div>
    )
}

export default Post