import { useState, useEffect } from 'react';
import { getSponsoredPosts } from '@components/utils/airdrops';
import { useAppContext } from '@components/utils/AppContext';
import Menu from '@components/Dashboard/Menu';
import Header from '@components/Home/Header';

const SponsoredPosts = () => {
    const { profiles } = useAppContext();
    const [sponsoredPosts, setSponsoredPosts] = useState<any>();

    useEffect(() => {
        const sponsoredPosts = async () => {
            const sponsoredPosts = (await getSponsoredPosts(profiles[0]?.ownedBy!))?.result?.toString();

            setSponsoredPosts(sponsoredPosts!);
        }
        if (profiles[0]) {
            sponsoredPosts();
        }
    }, []);

    return (
        <>
            <Header />
            <div className="flex">
                <Menu />
                <div className="text-center m-10 h-screen text-3xl">
                    <div>
                        Sponsored Posts
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Post</th>
                                <th>Reward Token</th>
                                <th>Reward Amount</th>
                                <th>Deadline</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                    // sponsoredPosts?.map((post) => {
                                    //     return (
                                    //         <tr>
                                    //             <td>{post.post}</td>
                                    //             <td>{post.rewardToken}</td>
                                    //             <td>{post.rewardAmount}</td>
                                    //             <td>{post.deadline}</td>
                                    //             <td>
                                    //                 <button>Claim</button>
                                    //             </td>
                                    //         </tr>
                                    //     )
                                    // })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default SponsoredPosts;