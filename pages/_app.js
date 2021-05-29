import '../public/site.css';
import Head from 'next/head'
import {DistrictsDataContextProvider} from '../store/dataContext/dataContext';
import {ControlsContextProvider} from '../store/dataContext/controlsContext';
import {SidebarContextProvider} from '../store/dataContext/sidebarContext';
import NavigationBar from '../components/NavigationBar/NavigationBar';

function MyApp({ Component, pageProps }) {
  return(
    <div>
      <Head>      
        <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.2.0/mapbox-gl.css" rel="stylesheet" key="test"/>
      </Head>
      <DistrictsDataContextProvider>
        <SidebarContextProvider>
          <ControlsContextProvider>
            <NavigationBar />
            <Component {...pageProps} />
          </ControlsContextProvider>
        </SidebarContextProvider>
      </DistrictsDataContextProvider>
    </div>    
  )
}

export default MyApp;
