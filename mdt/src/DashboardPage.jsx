import './App.css'
import React, { useState } from 'react'

import { useProfileStore } from './store'
import { useDashboardStore } from './store'

import {
    FormControl,
    Input,
    InputAdornment,
    InputLabel,
} from '@material-ui/core'

import moment from 'moment'

import formatDistance from 'date-fns/formatDistance'
import { et } from 'date-fns/locale'

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
            {/* <div style={{ maxWidth: '40%' }}>
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
            </div> */}
        </div>
    )
}

function Divider() {
    return <hr style={{ borderTop: '1px dashed' }}></hr>
}

function WarrantDiv(props) {
    const warrant = props.warrant
    return (
        <div className="ListItem" onClick={props.onClick}>
            <div>{warrant.character_name}</div>
            <div style={{ marginTop: '8px' }}>{warrant.reason}</div>
            <Divider />
            {formatDistance(new Date(warrant.timestamp * 1000), new Date(), {
                includeSeconds: true,
                locale: et,
            })}{' '}
            tagasi
        </div>
    )
}

function BulletinDiv(props) {
    const bulletin = props.bulletin
    return (
        <div className="ListItem" onClick={props.onClick}>
            <div>{bulletin.title}</div>
            <div style={{ marginTop: '8px' }}>{bulletin.description}</div>
            <Divider />
            {formatDistance(new Date(bulletin.timestamp * 1000), new Date(), {
                includeSeconds: true,
                locale: et,
            })}{' '}
            tagasi
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

function Page(props) {
    const [searchBarValue, setSearchBarValue] = useState('')

    const { changeCurrentCharacterId } = useProfileStore()
    const { bulletins, warrants, setBulletins, setWarrants } =
        useDashboardStore()

    function reloadPage() {
        props
            .doNuiAction(
                'fetchDashboardPage',
                [],
                {
                    warrants: [
                        {
                            id: 1,
                            timestamp: 1620665732,
                            character_id: 3,
                            character_name: 'Jean Pual',
                            reason: 'Really? 5 Cops for this?',
                        },
                    ],
                    bulletins: [
                        {
                            id: 1,
                            timestamp: 1634485964,
                            title: 'Tazerid',
                            description:
                                'inimeste autodest tazeriga vÃ¤lja laskmine = ban',
                        },
                    ],
                },
                true
            )
            .then((resp) => {
                setBulletins(resp.bulletins.sort(SortListByTime))
                setWarrants(resp.warrants.sort(SortListByTime))
            })
    }

    React.useEffect(() => {
        reloadPage()
    }, [])

    return (
        <div className="PageMain">
            <div
                className="PageSectionContainer"
                style={{ width: '50%', alignItems: 'center' }}
            >
                <Searchbar
                    name={'Tagaotsitavad'}
                    value={searchBarValue}
                    handleChange={(event) => {
                        setSearchBarValue(event.target.value)
                    }}
                />
                <div className="ListItemsContainer">
                    {warrants.map((warrant) => (
                        <WarrantDiv
                            warrant={warrant}
                            onClick={() => {
                                props.setPage('Profiles')
                                changeCurrentCharacterId(warrant.character_id)
                            }}
                        />
                    ))}
                </div>
            </div>
            <div className="PageSectionPadding" />
            <div className="PageSectionContainer" style={{ width: '50%' }}>
                Teadetetahvel
                <div className="ListItemsContainer">
                    {bulletins.map((bulletin) => (
                        <BulletinDiv bulletin={bulletin} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Page
