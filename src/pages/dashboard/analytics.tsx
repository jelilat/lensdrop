import Menu from '@components/Dashboard/Menu';
import Header from '@components/Home/Header';

const Analytics = () => {
    return(
        <>
            <Header />
            <div className="flex">
                <Menu />
                <div className="flex flex-col items-center m-10 h-screen text-3xl">
                    Coming soon, stay tuned!
                </div>
            </div>
        </>
    )
}

export default Analytics;