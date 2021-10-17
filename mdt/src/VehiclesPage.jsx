import './App.css'
import React, { useState } from 'react'

import { useProfileStore, useVehicleStore } from './store'

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
                        Numbrimärk
                    </InputLabel>
                    <Input
                        style={{ color: 'white' }}
                        value={props.value}
                        onChange={props.handleChange}
                        startAdornment={
                            <InputAdornment position="start">🚘</InputAdornment>
                        }
                    />
                </FormControl>
            </div>
        </div>
    )
}

function SearchResultDiv({ vehicle, click }) {
    return (
        <Button
            className="ListItemButton"
            style={{ backgroundColor: 'var(--dark)', marginTop: '4px' }}
            onClick={click}
        >
            {vehicle.plate} - {vehicle.model}
        </Button>
    )
}

function Page(props) {
    const { changeCurrentCharacterId } = useProfileStore()

    const {
        searchBarValue,
        setSearchBarValue,

        vehicleResults,
        setVehicleResults,

        currentVehicle,
        setCurrentVehicle,
    } = useVehicleStore()

    const getVehicleResults = async (query) => {
        return props.doNuiAction(
            'getVehicleResults',
            { query },
            [
                {
                    plate: 'ABCD1234',
                    model: 'Bati 801RR',
                },
                {
                    plate: 'ABCD1235',
                    model: 'Bati 802RR',
                },
            ],
            true
        )
    }

    const getVehicleData = async (vin) => {
        return props.doNuiAction(
            'getVehicleData',
            { vin },
            {
                vin: 1,
                plate: 'blabla',
                owner_id: 3,
                owner_name: 'Jean Paul',
                model: '801BatiRR',
                created_at: 1621274228,
            },
            true
        )
    }

    // SEARCH BAR START
    let searchBarDebounceId = React.useRef(0)
    React.useEffect(() => {
        searchBarDebounceId.current = searchBarDebounceId.current + 1
        let lastId = searchBarDebounceId.current
        setTimeout(async () => {
            if (
                searchBarDebounceId.current === lastId &&
                searchBarValue.length >= 3
            ) {
                setVehicleResults(await getVehicleResults(searchBarValue))
            } else {
                setVehicleResults([])
            }
        }, 200)
    }, [searchBarValue])
    // SEARCH BAR END

    const loadVehicleData = async (vin) => {
        setCurrentVehicle(await getVehicleData(vin))
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
                    name={'Sõidukid'}
                    value={searchBarValue}
                    handleChange={(event) => {
                        setSearchBarValue(event.target.value)
                    }}
                />

                <div className="ListItemsContainer">
                    {vehicleResults.map((vehicle) => (
                        <SearchResultDiv
                            vehicle={vehicle}
                            click={() => {
                                loadVehicleData(vehicle.vin)
                            }}
                        />
                    ))}
                </div>
            </div>
            <div className="PageSectionPadding" />
            <div className="PageSectionContainer" style={{ width: '100%' }}>
                {!currentVehicle && (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        Sõidukit Pole Valitud
                    </div>
                )}
                {currentVehicle && (
                    <div
                        style={{
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <div>
                            Sõiduki Omanik:{' '}
                            <Button
                                style={{ backgroundColor: 'var(--dark)' }}
                                onClick={() => {
                                    props.setPage('Profiles')
                                    changeCurrentCharacterId(
                                        currentVehicle.owner_id
                                    )
                                }}
                            >
                                {currentVehicle.owner_name}
                            </Button>
                        </div>
                        <div>Numbrimärk: {currentVehicle.plate}</div>
                        <div style={{ marginTop: '8px' }}>
                            Mudel: {currentVehicle.model}
                        </div>
                        <div style={{ marginTop: '8px' }}>
                            VIN: {currentVehicle.vin}
                        </div>

                        <div style={{ marginTop: '8px' }}>
                            Registreeritud:{' '}
                            {new Date(
                                currentVehicle.created_at * 1000
                            ).toLocaleDateString('en-US')}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Page
