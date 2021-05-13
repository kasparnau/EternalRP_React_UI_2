import './App.css'
import React, { useState } from 'react'

import { useProfileStore } from './store'

import {
    Button,
    FilledInput,
    FormControl,
    Input,
    InputAdornment,
    InputLabel,
    makeStyles,
    TextField,
} from '@material-ui/core'
import Chip from '@material-ui/core/Chip'
import { Editor, EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import Modal from 'react-modal'

import moment from 'moment'

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            color: 'white',
        },
        '& .MuiTypography-colorTextSecondary': {
            color: 'white',
        },
        '& .MuiInputLabel-formControl': {
            color: 'white',
        },
        '& .MuiFilledInput-input': {
            color: 'white',
        },
    },
    maleButton: {
        backgroundColor: 'hsla(208, 100%, 50%, 0.1)',
        '&:hover': {
            backgroundColor: 'hsla(208, 100%, 50%, 0.3)',
        },
    },
    femaleButton: {
        backgroundColor: 'hsla(333, 100%, 50%, 0.1)',
        '&:hover': {
            backgroundColor: 'hsla(333, 100%, 50%, 0.3)',
        },
    },
}))

function MakeWantedModal(props) {
    const { closeModal, values, setValue } = props
    const classes = useStyles()
    return (
        <div style={{ height: '100%', weight: '100%' }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <FormControl
                    style={{ width: '100%' }}
                    variant="filled"
                    className={classes.root}
                >
                    <InputLabel htmlFor="filled-adornment-amount">
                        Reason
                    </InputLabel>
                    <FilledInput
                        id="filled-adornment-amount"
                        value={values.reason}
                        multiline
                        onChange={(event) => {
                            setValue('reason', event.target.value)
                        }}
                    />
                </FormControl>
            </div>

            {/* FINALIZE: */}
            <div
                style={{
                    marginTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Button
                    style={{
                        width: '50%',
                        backgroundColor: '#ce8e4c',
                        marginRight: '5px',
                    }}
                    onClick={closeModal}
                >
                    CANCEL
                </Button>
                <Button
                    onClick={props.makeWanted}
                    style={{
                        width: '50%',
                        backgroundColor: 'rgb(218, 82, 89)',
                        marginLeft: '5px',
                    }}
                >
                    MAKE WANTED
                </Button>
            </div>
        </div>
    )
}

function Divider() {
    return <hr style={{ borderTop: '1px dashed' }}></hr>
}

function Searchbar(props) {
    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <div style={{ maxWidth: '40%' }}>{props.name}</div>
            <div style={{ maxWidth: '60%' }}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="standard-adornment-amount">
                        Search
                    </InputLabel>
                    <Input
                        style={{ color: 'white' }}
                        id="standard-adornment-amount"
                        value={props.value}
                        onChange={props.handleChange}
                        startAdornment={
                            <InputAdornment position="start">🔍</InputAdornment>
                        }
                    />
                </FormControl>
            </div>
        </div>
    )
}

function DataSection(props) {
    return (
        <div
            style={{
                backgroundColor: 'hsla(218, 31%, 12%, 0.541)',
                width: '100%',
                marginTop: props.marginTop && '8px',
                color: props.color && props.color,
            }}
        >
            <div style={{ padding: '8px' }}>
                <div style={{ marginBottom: '8px' }}>{props.name}</div>
                <div>{props.children}</div>
            </div>
        </div>
    )
}

function SortListByTime(a, b) {
    if (a.timestamp < b.timestamp) {
        return 1
    }
    if (a.timestamp > b.timestamp) {
        return -1
    }
    return 0
}

function ProfileDiv(props) {
    const profile = props.profile
    return (
        <div className="ListItem" onClick={props.onClick}>
            <div>{profile.character_name}</div>
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
                ID: {profile.character_id}
            </div>
        </div>
    )
}

function Page(props) {
    const [searchBarValue, setSearchBarValue] = useState('')
    const [profileRows, setProfileRows] = useState([])

    const changeProfilePageCharacterId = useProfileStore(
        (state) => state.changeCurrentCharacterId
    ) /* CHANGE SELECTED PROFILE */

    const currentCharacterId = useProfileStore(
        (store) => store.currentCharacterId
    ) /* CURRENT SELECTED PROFILE */

    const changeProfilePageData = useProfileStore(
        (state) => state.changeProfilePageData
    ) /* CHANGE SELECTED PROFILE */

    const profilePageData = useProfileStore(
        (store) => store.profilePageData
    ) /* CURRENT SELECTED PROFILE */

    // MODAL STUFF START
    const [modalValues, setModalValues] = React.useState({
        reason: '',
    })

    function setModalValue(name, value) {
        setModalValues({ ...modalValues, [name]: value })
    }
    const [currentModal, setCurrentModal] = useState(false)

    function closeModal() {
        setCurrentModal(false)
    }

    function openWantedModal() {
        setCurrentModal('Wanted')
    }
    // MODAL STUFF END

    const [currentProfileImageURL, setCurrentProfileImageURL] = useState('')

    const [editorState, setEditorState] = React.useState(() =>
        EditorState.createEmpty()
    )

    React.useEffect(() => {
        const contentState = editorState.getCurrentContent()
        console.log('content state', JSON.stringify(convertToRaw(contentState)))
    }, [editorState])

    function reloadPage() {
        props
            .doNuiAction(
                'fetchProfileData',
                { character_id: currentCharacterId },
                {
                    character_id: 3,
                    character_name: 'Big Name',
                    profile_image_url: 'https://i.imgur.com/LExuDrt.png',
                    faction_name: 'LSPD',
                    warrant: {
                        reason: 'LOL!!!!!',
                        last_update: 1620679520,
                    },
                }
            )
            .then((resp) => {
                setCurrentProfileImageURL(
                    resp.profile_image_url ? resp.profile_image_url : ''
                )
                if (resp.description) {
                    setEditorState(
                        EditorState.createWithContent(
                            convertFromRaw(JSON.parse(resp.description))
                        )
                    )
                } else {
                    setEditorState(EditorState.createEmpty())
                }
                changeProfilePageData(resp)
            })
    }

    function makeWanted() {
        console.log(profilePageData.character_id, modalValues.reason)
        setCurrentModal(false)

        props
            .doNuiAction(
                'makeWanted',
                {
                    character_id: profilePageData.character_id,
                    reason: modalValues.reason,
                },
                {}
            )
            .then(() => {
                reloadPage()
            })
    }

    function removeWarrant() {
        props
            .doNuiAction(
                'removeWarrant',
                {
                    character_id: profilePageData.character_id,
                },
                []
            )
            .then(() => {
                reloadPage()
            })
    }

    function saveProfile() {
        const contentState = JSON.stringify(
            convertToRaw(editorState.getCurrentContent())
        )

        if (
            currentProfileImageURL !== profilePageData.profile_image_url ||
            contentState !== profilePageData.description
        ) {
            props
                .doNuiAction(
                    'updateProfile',
                    {
                        profile_image_url: currentProfileImageURL,
                        description: contentState,
                        character_id: profilePageData.character_id,
                    },
                    []
                )
                .then(() => {
                    reloadPage()
                })
        }
    }

    React.useEffect(() => {
        if (currentCharacterId !== 0) {
            reloadPage()
        }
    }, [currentCharacterId])

    let searchBarDebounceId = React.useRef(0)
    React.useEffect(() => {
        searchBarDebounceId.current = searchBarDebounceId.current + 1
        let lastId = searchBarDebounceId.current
        setTimeout(() => {
            if (
                searchBarDebounceId.current === lastId &&
                searchBarValue.length >= 3
            ) {
                setProfileRows([])
                props
                    .doNuiAction(
                        'getProfileResults',
                        { query: searchBarValue },
                        [
                            {
                                character_id: 1,
                                character_name: 'Jean Paul',
                            },
                            {
                                character_id: 2,
                                character_name: 'Indrek',
                            },
                        ],
                        true
                    )
                    .then((resp) => {
                        setProfileRows(resp)
                    })
            } else {
                setProfileRows([])
            }
        }, 200)
    }, [searchBarValue])

    return (
        <div className="PageMain">
            <div
                className="PageSectionContainer"
                style={{ width: '35%', alignItems: 'center' }}
            >
                <Searchbar
                    name={'Profiles'}
                    value={searchBarValue}
                    handleChange={(event) => {
                        setSearchBarValue(event.target.value)
                    }}
                />
                <div className="ListItemsContainer">
                    {profileRows.map((profile) => (
                        <ProfileDiv
                            profile={profile}
                            onClick={() => {
                                changeProfilePageCharacterId(
                                    profile.character_id
                                )
                            }}
                        />
                    ))}
                </div>
            </div>
            <div className="PageSectionPadding" />
            <div className="PageSectionContainer" style={{ width: '100%' }}>
                {!profilePageData && (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        No Profile Selected
                    </div>
                )}
                {profilePageData && (
                    <div
                        style={{
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                        }}
                    >
                        <div
                            style={{
                                width: '50%',
                                height: '100%',
                                marginRight: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                }}
                            >
                                <div style={{ width: '40%' }}>
                                    Profile (#{profilePageData.character_id})
                                </div>
                                <div
                                    style={{
                                        width: '60%',
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <div>
                                        {!!!profilePageData.warrant && (
                                            <Button
                                                style={{
                                                    backgroundColor:
                                                        'rgb(218, 82, 89)',
                                                    marginRight: '8px',
                                                }}
                                                onClick={openWantedModal}
                                            >
                                                MAKE WANTED
                                            </Button>
                                        )}
                                        {!!profilePageData.warrant && (
                                            <Button
                                                style={{
                                                    backgroundColor:
                                                        'rgb(218, 82, 89)',
                                                    marginRight: '8px',
                                                }}
                                                onClick={removeWarrant}
                                            >
                                                REMOVE WARRANT
                                            </Button>
                                        )}
                                    </div>
                                    <div>
                                        <Button
                                            style={{
                                                backgroundColor:
                                                    'rgb(37, 146, 81)',
                                            }}
                                            onClick={saveProfile}
                                        >
                                            SAVE
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: '16px', display: 'flex' }}>
                                <div style={{ height: '100%', width: '8vw' }}>
                                    <img
                                        src={
                                            profilePageData.profile_image_url
                                                ? profilePageData.profile_image_url
                                                : 'https://i.imgur.com/CnRussR.jpg'
                                        }
                                        style={{
                                            width: '8vw',
                                            height: '8vw',
                                            objectFit: 'contain',
                                        }}
                                    />
                                </div>
                                <div
                                    style={{
                                        marginLeft: '8px',
                                        width: '100%',
                                    }}
                                >
                                    <div>
                                        Name: {profilePageData.character_name}
                                    </div>
                                    <div style={{ marginTop: '8px' }}>
                                        Citizen ID:{' '}
                                        {profilePageData.character_id}
                                    </div>
                                    <div style={{ marginTop: '8px' }}>
                                        {profilePageData.faction_name && (
                                            <div>
                                                Faction:{' '}
                                                {profilePageData.faction_name}
                                            </div>
                                        )}
                                        {!profilePageData.faction_name && (
                                            <div>No Faction</div>
                                        )}
                                    </div>
                                    <div
                                        style={{
                                            marginTop: '8px',
                                            maxWidth: '90%',
                                        }}
                                    >
                                        <FormControl fullWidth>
                                            <InputLabel htmlFor="standard-adornment-amount">
                                                Profile Image URL
                                            </InputLabel>
                                            <Input
                                                style={{ color: 'white' }}
                                                id="standard-adornment-amount"
                                                value={currentProfileImageURL}
                                                onChange={(event) => {
                                                    setCurrentProfileImageURL(
                                                        event.target.value
                                                    )
                                                }}
                                            />
                                        </FormControl>
                                    </div>
                                </div>
                            </div>
                            <div style={{ paddingTop: '16px' }} />
                            <div
                                style={{
                                    backgroundColor: '#151b27',
                                    height: '100%',
                                    overflow: 'hidden',
                                    fontFamily: 'Roboto',
                                    fontSize: '16px',
                                }}
                            >
                                <Editor
                                    editorState={editorState}
                                    onChange={setEditorState}
                                />
                            </div>
                            {/* INFO END - BUTTONS START */}
                            {/* <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <div
                                    style={{
                                        marginRight: '16px',
                                    }}
                                >
                                    <Button
                                        style={{
                                            backgroundColor: 'rgb(218, 82, 89)',
                                        }}
                                        onClick={saveProfile}
                                    >
                                        MAKE WANTED
                                    </Button>
                                </div>

                                <div style={{ marginRight: '16px' }}>
                                    <Button
                                        style={{
                                            backgroundColor: 'rgb(37, 146, 81)',
                                            width: '25%',
                                        }}
                                        onClick={saveProfile}
                                    >
                                        SAVE
                                    </Button>
                                </div>
                            </div> */}
                        </div>
                        <div
                            style={{
                                width: '50%',
                                height: '100%',
                            }}
                        >
                            {!!profilePageData.warrant && (
                                <DataSection
                                    name="PERSON IS WANTED"
                                    color="red"
                                >
                                    <div
                                        style={{
                                            fontSize: '14px',
                                            color: 'white',
                                        }}
                                    >
                                        <div>
                                            Reason:{' '}
                                            {profilePageData.warrant.reason}
                                        </div>
                                        <Divider />
                                        <div>
                                            {moment(
                                                profilePageData.warrant
                                                    .last_update * 1000
                                            ).fromNow()}
                                        </div>
                                    </div>
                                </DataSection>
                            )}
                            <DataSection name="Licenses" marginTop>
                                <Chip label="Drivers License" />
                            </DataSection>
                            <DataSection name="Vehicles" marginTop>
                                <Chip label="Drivers License" />
                            </DataSection>
                            <DataSection name="Housing" marginTop>
                                <Chip label="Drivers License" />
                            </DataSection>
                            <DataSection name="Priors" marginTop>
                                <Chip label="Drivers License" />
                            </DataSection>
                        </div>
                    </div>
                )}
            </div>
            {currentModal && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Modal
                        className="Modal"
                        isOpen={!!currentModal}
                        onRequestClose={closeModal}
                        style={{
                            overlay: {
                                backgroundColor: 'rgba(255, 255, 255, 0)',
                            },
                        }}
                    >
                        <div className="ModalContainer">
                            <MakeWantedModal
                                closeModal={closeModal}
                                values={modalValues}
                                setValue={setModalValue}
                                makeWanted={makeWanted}
                            />
                        </div>
                    </Modal>
                </div>
            )}
        </div>
    )
}

export default Page
