import React, {useEffect, useRef, useState} from 'react';
import {Box} from '@mui/material';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import '@/App.scss';
import RecordingList from "@/components/pages/recording/list/RecordingList";
import RecordingPlayer from "@/components/pages/recording/player/RecordingPlayer";
import {gqlClient} from "@/graphql/Client";
import {ApolloProvider} from "@apollo/client";
import RecordingDetail from "@/components/pages/recording/detail/RecordingDetail";
import AppTopHeader from "@/components/atoms/AppTopHeader";
import Cleaner from "@/components/pages/cleaner/Cleaner";
import AppBottomFooter from "@/components/atoms/AppBottomFooter";

const baseName = '/falp';

function useBounds<T extends HTMLElement>(elementRef: React.RefObject<T>) {
  const [bounds, setBounds] = useState({width: '0', height: '0'});
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const el = elementRef.current!;
      setBounds({
        width: `${el.clientWidth}px`,
        height: `${el.clientHeight}px`,
      });
    });
    elementRef.current && observer.observe(elementRef.current);
    return () => {
      observer.disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return bounds;
}

function AppContent() {
  const routes = (
    <Routes>
      <Route index element={<Navigate to="recordings" replace />} />
      <Route path="/recordings" element={<RecordingList />} />
      <Route path="/recordings/:pId" element={<RecordingDetail />} />
      <Route path="/recordings/player/:pId" element={<RecordingPlayer />} />
      <Route path="/cleaner" element={<Cleaner />} />
    </Routes>
  );

  const appTopHeaderRef = useRef<HTMLDivElement>(null);
  const appTopHeaderBounds = useBounds(appTopHeaderRef);
  const appHeaderRef = useRef<HTMLElement>(null);
  const appHeaderBounds = useBounds(appHeaderRef);
  const appFooterRef = useRef<HTMLElement>(null);
  const appFooterBounds = useBounds(appFooterRef);
  const appBottomFooterRef = useRef<HTMLDivElement>(null);
  const appBottomFooterBounds = useBounds(appBottomFooterRef);
  return (
    <>
      <AppTopHeader ref={appTopHeaderRef} />
      <Box sx={{
        flexGrow: 1,
        paddingTop: appTopHeaderBounds.height,
        paddingBottom: appBottomFooterBounds.height,
      }}>
        <Box id="app-header" sx={{ top: appTopHeaderBounds.height }} ref={appHeaderRef} />
        <Box id="app-header-spacer" sx={{height: appHeaderBounds.height }} />
        {routes}
        <Box id="app-footer" ref={appFooterRef} />
        <Box id="app-footer-spacer" sx={{height: appFooterBounds.height }} />
      </Box>
      <AppBottomFooter ref={appBottomFooterRef} />
    </>
  );
}

function App() {
  return (
    <ApolloProvider client={gqlClient}>
      <BrowserRouter basename={baseName}>
        <Box className="App" sx={{ display: 'flex' }}>
          <AppContent />
        </Box>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
