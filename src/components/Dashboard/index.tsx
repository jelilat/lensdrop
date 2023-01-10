import Menu from './Menu';
import Board from './Board';
import Header from '@components/Home/Header';

const Dashboard = () => {
    return (
        <div> 
            <Header />
           <div className='flex'>
                <Menu />   
                <Board /> 
           </div>
        </div>
    );
}

export default Dashboard;