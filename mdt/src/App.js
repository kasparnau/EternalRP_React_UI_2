import './App.css'

import React, { useState } from 'react'

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { motion, AnimatePresence } from 'framer-motion'

import Spinner from 'react-spinners/RotateLoader'
import sendNUI from './sendNUI'

import DashboardPage from './DashboardPage'
import ProfilesPage from './ProfilesPage'
import ChargesPage from './ChargesPage'
import VehiclesPage from './VehiclesPage'

import { Button } from '@material-ui/core'

const IS_PROD = process.env.NODE_ENV === 'production'

function SidebarButton(props) {
    const [isHovered, setHovered] = useState(false)

    return (
        <Button
            className="SidebarButton"
            onClick={() => {
                props.onClick(props.name)
            }}
            style={{
                backgroundColor:
                    props.currentPage === props.name
                        ? '#30455f'
                        : 'var(--dark)',
                width: '100%',
                borderRadius: '0px',
            }}
            size="large"
        >
            {props.name}
        </Button>
    )
}

const PageAnimateWrapper = (props) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    height: '100%',
                    width: '100%',
                }}
            >
                {props.children}
            </motion.div>
        </AnimatePresence>
    )
}

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
    },
})

const Menus = ['Dashboard', 'Profiles', 'Charges', 'Vehicles']

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

    const framerVariants = {
        open: { scaleY: 1 },
        closed: { scaleY: 0 },
    }

    return (
        <div className="AppHolder">
            <AnimatePresence>
                {canShow && (
                    <motion.div
                        className="App"
                        initial={{ scaleY: 0 }}
                        exit={{ scaleY: 0 }}
                        transition={{ duration: 0.2 }}
                        animate={canShow ? 'open' : 'closed'}
                        variants={framerVariants}
                    >
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

                            <div
                                className="Main"
                                style={{
                                    display: !loading ? 'flex' : 'none', // TO SAVE STATE WHEN RELOADING
                                }}
                            >
                                <div className="Sidebar">{sidebarRows}</div>

                                <div className="Container">
                                    {currentPage === 'Dashboard' && (
                                        <PageAnimateWrapper>
                                            <DashboardPage
                                                doNuiAction={doNuiAction}
                                                setPage={setPage}
                                            />
                                        </PageAnimateWrapper>
                                    )}

                                    {currentPage === 'Profiles' && (
                                        <PageAnimateWrapper>
                                            <ProfilesPage
                                                doNuiAction={doNuiAction}
                                                setPage={setPage}
                                            />
                                        </PageAnimateWrapper>
                                    )}

                                    {currentPage === 'Charges' && (
                                        <PageAnimateWrapper>
                                            <ChargesPage
                                                doNuiAction={doNuiAction}
                                                setPage={setPage}
                                            />
                                        </PageAnimateWrapper>
                                    )}

                                    {currentPage === 'Vehicles' && (
                                        <PageAnimateWrapper>
                                            <VehiclesPage
                                                doNuiAction={doNuiAction}
                                                setPage={setPage}
                                            />
                                        </PageAnimateWrapper>
                                    )}
                                </div>
                            </div>
                        </ThemeProvider>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default App
