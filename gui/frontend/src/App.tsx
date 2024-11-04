import React from 'react';
import {Stack} from "@mui/material";
import {InfoBar, MediaList, SearchBox} from "./components";
import './App.css';

const App = () => {
    return (
        <Stack id="app" spacing="1em">
            <SearchBox/>

            <InfoBar/>

            <MediaList/>
        </Stack>
    )
}

export default App
