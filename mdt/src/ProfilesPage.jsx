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
import Modal from 'react-modal'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // ES6

import formatDistance from 'date-fns/formatDistance'
import { et } from 'date-fns/locale'

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
    const { closeModal } = props
    const classes = useStyles()
    const [reason, setReason] = useState('')

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
                        Põhjus
                    </InputLabel>
                    <FilledInput
                        value={reason}
                        multiline
                        onChange={(event) => {
                            setReason(event.target.value)
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
                    TÜHISTA
                </Button>
                <Button
                    onClick={() => {
                        props.makeWanted(reason)
                    }}
                    style={{
                        width: '50%',
                        backgroundColor: 'var(--red)',
                        marginLeft: '5px',
                    }}
                >
                    TEE TAGAOTSITAVAKS
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
            <div style={{ maxWidth: '40%', fontSize: '1.0rem' }}>
                {props.name}
            </div>
            <div style={{ maxWidth: '60%' }}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="standard-adornment-amount">
                        Nimi
                    </InputLabel>
                    <Input
                        style={{ color: 'white' }}
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
    const { profileRows, setProfileRows } = useProfileStore()
    const { searchBarValue, setSearchBarValue } = useProfileStore()

    const { changeCurrentCharacterId, currentCharacterId } = useProfileStore()
    const { setCurrentProfile, currentProfile } = useProfileStore()
    const { currentProfileImageURL, setCurrentProfileImageURL } =
        useProfileStore()
    const { editorState, setEditorState } = useProfileStore()

    // MODAL STUFF START
    const [currentModal, setCurrentModal] = useState(false)

    function closeModal() {
        setCurrentModal(false)
    }

    function openWantedModal() {
        setCurrentModal('Wanted')
    }
    // MODAL STUFF END

    function reloadPage() {
        props
            .doNuiAction(
                'fetchProfileData',
                { character_id: currentCharacterId },
                {
                    character_id: 3,
                    character_name: 'Juhan Kallas',
                    profile_image_url: 'https://i.imgur.com/LExuDrt.png',
                    born: '1999-01-01',
                    faction_name: 'LSPD',
                    description: 'LOL',

                    // warrant: {
                    //     reason: 'LOL!!!!!',
                    //     last_update: 1620679520,
                    // },

                    vehicles: [
                        { plate: 'ABCD1234', model: 'Sultan MK2' },
                        { plate: 'ABCD1235', model: 'Futo' },
                        { plate: 'ABCD1236', model: 'Nigga' },
                    ],

                    housing: [],
                    priors: [],
                    licenses: [],
                }
            )
            .then((resp) => {
                setCurrentProfileImageURL(
                    resp.profile_image_url ? resp.profile_image_url : ''
                )
                if (resp.description) {
                    setEditorState(resp.description)
                } else {
                    setEditorState('')
                }

                setCurrentProfile(resp)
            })
    }

    function makeWanted(reason) {
        setCurrentModal(false)

        props
            .doNuiAction(
                'makeWanted',
                {
                    character_id: currentProfile.character_id,
                    reason,
                },
                true,
                true
            )
            .then((success) => {
                if (success) {
                    setCurrentProfile({
                        ...currentProfile,
                        warrant: { reason, last_update: Date.now() / 1000 },
                    })
                }
            })
    }

    function removeWarrant() {
        props
            .doNuiAction(
                'removeWarrant',
                {
                    character_id: currentProfile.character_id,
                },
                true,
                true
            )
            .then((success) => {
                if (success) {
                    setCurrentProfile({
                        ...currentProfile,
                        warrant: false,
                    })
                }
            })
    }

    const checkCharacterCount = (event) => {
        const ctrlA = event.code == 'KeyA' && event.ctrlKey
        if (
            editorState.length >= 2000 &&
            event.key !== 'Backspace' &&
            ctrlA === false
        ) {
            event.preventDefault()
        }
    }

    function handleEditorState(value) {
        setEditorState(value)
    }

    function saveProfile() {
        if (
            currentProfileImageURL !== currentProfile.profile_image_url ||
            editorState !== currentProfile.description
        ) {
            props
                .doNuiAction(
                    'updateProfile',
                    {
                        profile_image_url: currentProfileImageURL,
                        description: editorState,
                        character_id: currentProfile.character_id,
                    },
                    true,
                    true
                )
                .then((success) => {
                    if (success) {
                        setCurrentProfile({
                            ...currentProfile,
                            profile_image_url: currentProfileImageURL,
                            description: editorState,
                            character_id: currentProfile.character_id,
                        })
                    }
                })
        }
    }

    React.useEffect(() => {
        if (currentCharacterId !== 0) {
            if (currentProfile?.character_id === currentCharacterId) {
                return
            } else {
                reloadPage()
            }
        }
    }, [currentCharacterId])

    let searchBarDebounceId = React.useRef(0)
    React.useEffect(() => {
        searchBarDebounceId.current = searchBarDebounceId.current + 1
        let lastId = searchBarDebounceId.current

        setTimeout(() => {
            if (
                searchBarDebounceId.current === lastId &&
                searchBarValue.length >= 1
            ) {
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

    const removeLicense = (license) => {
        console.log('Delete: ' + license)
        props
            .doNuiAction(
                'removeLicense',
                { character_id: currentProfile.character_id, license },
                [],
                true
            )
            .then((success) => {
                if (success) {
                    const newLicenses = currentProfile.licenses.filter(
                        (aLicense) => aLicense.id !== license
                    )
                    setCurrentProfile({
                        ...currentProfile,
                        licenses: newLicenses,
                    })
                }
            })
    }

    return (
        <div className="PageMain">
            <div
                className="PageSectionContainer"
                style={{
                    width: '25%',
                    alignItems: 'center',
                    minWidth: '150px',
                    maxWidth: '250px',
                }}
            >
                <Searchbar
                    name={'Profiilid'}
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
                                changeCurrentCharacterId(profile.character_id)
                            }}
                        />
                    ))}
                </div>
            </div>
            <div className="PageSectionPadding" />
            <div className="PageSectionContainer" style={{ width: '100%' }}>
                {!currentProfile && (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        Profiili Pole Valitud
                    </div>
                )}
                {currentProfile && (
                    <div
                        style={{
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                        }}
                    >
                        <div
                            style={{
                                width: '55%',
                                height: '100%',
                                marginRight: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                }}
                            >
                                <div>Profiil</div>
                                <div
                                    style={{
                                        width: '100%',
                                        marginLeft: '4px',
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <div>
                                        <Button
                                            style={{
                                                backgroundColor:
                                                    'var(--yellow)',
                                                marginRight: '8px',
                                            }}
                                        >
                                            TRAHVID
                                        </Button>
                                        {!!!currentProfile.warrant && (
                                            <Button
                                                style={{
                                                    backgroundColor:
                                                        'var(--red)',
                                                    marginRight: '8px',
                                                }}
                                                onClick={openWantedModal}
                                            >
                                                TEE TAGAOTSITAVAKS
                                            </Button>
                                        )}
                                        {!!currentProfile.warrant && (
                                            <Button
                                                style={{
                                                    backgroundColor:
                                                        'var(--red)',
                                                    marginRight: '8px',
                                                }}
                                                onClick={removeWarrant}
                                            >
                                                EEMALDA TAGAOTSITAVUS
                                            </Button>
                                        )}
                                        <Button
                                            style={{
                                                backgroundColor: 'var(--green)',
                                            }}
                                            onClick={saveProfile}
                                        >
                                            SALVESTA
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: '16px', display: 'flex' }}>
                                <div style={{ height: '100%', width: '8vw' }}>
                                    <img
                                        src={
                                            currentProfile.profile_image_url
                                                ? currentProfile.profile_image_url
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
                                        Nimi: {currentProfile.character_name}
                                    </div>
                                    <div>Sündinud: {currentProfile.born}</div>
                                    <div>
                                        Kodaniku ID:{' '}
                                        {currentProfile.character_id}
                                    </div>
                                    <div>
                                        {currentProfile.faction_name && (
                                            <div>
                                                Grupeering:{' '}
                                                {currentProfile.faction_name}
                                            </div>
                                        )}
                                        {!currentProfile.faction_name && (
                                            <div>Pole Grupeeringut</div>
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
                                                Profiilipildi URL
                                            </InputLabel>
                                            <Input
                                                style={{ color: 'white' }}
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
                                    fontFamily: 'Roboto',
                                    backgroundColor: 'var(--dark)',
                                    overflowY: 'hidden',
                                }}
                            >
                                <ReactQuill
                                    style={{
                                        color: 'white',
                                        height: '600px',
                                        overflowWrap: 'anywhere',
                                        wordBreak: 'break-all',
                                        border: '0 !important',
                                    }}
                                    value={editorState}
                                    onChange={handleEditorState}
                                    placeholder={'Description about person'}
                                    onKeyDown={checkCharacterCount}
                                />
                            </div>
                        </div>
                        <div
                            style={{
                                width: '45%',
                                height: '100%',
                                overflowY: 'auto',
                            }}
                        >
                            {!!currentProfile.warrant && (
                                <DataSection
                                    name="ISIK ON TAGAOTSITAV"
                                    color="red"
                                >
                                    <div
                                        style={{
                                            fontSize: '0.88rem',
                                            color: 'white',
                                        }}
                                    >
                                        <div>
                                            {currentProfile.warrant.reason}
                                        </div>
                                        <Divider />
                                        <div>
                                            {formatDistance(
                                                new Date(
                                                    currentProfile.warrant
                                                        .last_update * 1000
                                                ),
                                                new Date(),
                                                {
                                                    includeSeconds: true,
                                                    locale: et,
                                                }
                                            )}{' '}
                                            tagasi
                                        </div>
                                    </div>
                                </DataSection>
                            )}
                            <DataSection name="Load" marginTop>
                                {currentProfile.licenses &&
                                    currentProfile.licenses.map((license) => {
                                        console.log(JSON.stringify(license))
                                        return (
                                            <Chip
                                                style={{ margin: '2px' }}
                                                label={`${license.license_name}`}
                                                onDelete={() => {
                                                    removeLicense(license.id)
                                                }}
                                            />
                                        )
                                    })}
                            </DataSection>
                            <DataSection name="Sõidukid" marginTop>
                                {currentProfile.vehicles &&
                                    currentProfile.vehicles.map((vehicle) => (
                                        <Chip
                                            style={{ margin: '2px' }}
                                            label={`${vehicle.plate} - ${vehicle.model}`}
                                        />
                                    ))}
                            </DataSection>
                            <DataSection name="Kinnisvara" marginTop>
                                {currentProfile.housing &&
                                    currentProfile.housing.map((property) => (
                                        <Chip
                                            style={{ margin: '2px' }}
                                            label={`${property.street}`}
                                        />
                                    ))}
                            </DataSection>
                            <DataSection name="Eelnevad Karistused" marginTop>
                                {currentProfile.priors &&
                                    currentProfile.priors.map((crime) => (
                                        <Chip
                                            style={{ margin: '2px' }}
                                            label={`(${crime.count}) ${crime.name}`}
                                        />
                                    ))}
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
