import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const UserLayout = () => {
    return (
        <div className='App'>
          <div className='wrapper'>
            <Sidebar />
            <div class="main-panel">
              <Header/>
              <Outlet/>
              <Footer/>
            </div>
          </div>
        </div>    
    )
}

export default UserLayout