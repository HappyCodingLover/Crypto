import React, { useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import Index from './pages';
import {checkMobile} from "./utils";
import {setIsMobile} from "./actions/uiActions";

export default function APP(props){
    const {theme} = useSelector(state=>state.uiConfig);
    useEffect(()=>{
        if(theme=="dark")
           document.body.classList.add('dark');
        else
            document.body.classList.remove('dark');
    },[theme]);
    const reduxDispatch = useDispatch();
    const handleWindowSizeChange = () => {
        const isMobileWidth = checkMobile();
        reduxDispatch(setIsMobile(isMobileWidth));
        console.log(isMobileWidth,"isMObile width");
   }
   useEffect(()=>{
      window.addEventListener('resize', handleWindowSizeChange);
      handleWindowSizeChange();
   },[]);


    return (
      <>
        <BrowserRouter>
          <Route component={ScrollToTop} />
            <Index />
        </BrowserRouter>
      </>
    );

}

const ScrollToTop = () => {
  window.scrollTo(0, 0);
  return null;
};


