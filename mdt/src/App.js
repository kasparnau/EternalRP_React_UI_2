import './App.css'

import React, { useState } from 'react'

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import Spinner from 'react-spinners/RotateLoader'
import sendNUI from './sendNUI.jsx'

import DashboardPage from './DashboardPage.jsx'
import ProfilesPage from './ProfilesPage.jsx'

const IS_PROD = process.env.NODE_ENV === 'production'

function SidebarButton(props) {
    return (
        <div
            className="SidebarButton"
            onClick={() => {
                props.onClick(props.name)
            }}
            style={{
                backgroundColor:
                    props.currentPage === props.name ? '#30455f' : '#151b27',
            }}
        >
            <Typography variant="h6" style={{ fontFamily: 'DM Mono' }}>
                {props.name}
            </Typography>
        </div>
    )
}

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
    },
})

const Menus = ['Dashboard', 'Profiles', 'Charges']

function App() {
    const [canShow, updateShow] = useState(!IS_PROD)

    const [currentPage, setPage] = useState('Dashboard')

    const [loading, setLoading] = useState(false)

    React.useEffect(() => {
        window.addEventListener('message', (event) => {
            if (event.data.show !== undefined) {
                updateShow(event.data.show)
            }
        })

        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                sendNUI('closeNui', {}, () => {})
            }
        })
    }, [])

    async function doNuiAction(action, data, mockAnswer, skipLoading) {
        if (!skipLoading) {
            setLoading(true)
        }

        const result = await sendNUI(action, data, mockAnswer)

        if (!skipLoading) {
            setLoading(false)
        }

        return result
    }

    const sidebarRows = []
    for (let name of Menus) {
        const row = (
            <SidebarButton
                name={name}
                onClick={setPage}
                currentPage={currentPage}
            />
        )
        sidebarRows.push(row)
    }

    return (
        <div>
            {canShow && (
                <div className="App">
                    <ThemeProvider theme={darkTheme}>
                        <div className="Topbar">MDT</div>

                        {loading && (
                            <div className="Main">
                                <div className="Spinner">
                                    <Spinner
                                        color="white"
                                        size={15}
                                        loading={loading}
                                    />
                                </div>
                            </div>
                        )}

                        {canShow && (
                            <div
                                className="Main"
                                style={{ display: !loading ? 'flex' : 'none' }}
                            >
                                <div className="Sidebar">{sidebarRows}</div>

                                <div className="Container">
                                    {currentPage === 'Dashboard' && (
                                        <DashboardPage
                                            doNuiAction={doNuiAction}
                                            setPage={setPage}
                                        />
                                    )}

                                    {currentPage === 'Profiles' && (
                                        <ProfilesPage
                                            doNuiAction={doNuiAction}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </ThemeProvider>
                </div>
            )}
        </div>
    )
}

export default App
