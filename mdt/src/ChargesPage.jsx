import './App.css'
import React, { useState } from 'react'

import { useProfileStore, useChargesStore } from './store'
import {
    Button,
    FormControl,
    Input,
    InputLabel,
    MenuItem,
    Select,
} from '@material-ui/core'
import { motion } from 'framer-motion'

const moneyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

const ChargeOptions = {
    OffensesAgainstPersons: [
        {
            name: 'Tulirelvaga Vehkimine',
            jail: 7,
            fine: 525,
            color: 1,
        },

        {
            name: 'Ründamine & Löömine',
            jail: 11,
            fine: 825,
            color: 1,
        },
        {
            name: 'Ebaseaduslikult Vangistamine',
            jail: 11,
            fine: 825,
            color: 1,
        },
        {
            name: 'Hoolimatu Ohustamine',
            jail: 11,
            fine: 825,
            color: 1,
        },
        {
            name: 'Kriminaalne Ähvardamine',
            jail: 14,
            fine: 1050,
            color: 1,
        },
        {
            name: 'Inimröövimine',
            jail: 15,
            fine: 1050,
            color: 2,
        },
        {
            name: 'Riigiametniku Inimröövimine',
            jail: 30,
            fine: 3500,
            color: 2,
        },
        {
            name: 'Rünnak Surmava Relvaga',
            jail: 21,
            fine: 1575,
            color: 2,
        },
        {
            name: 'Teise Astme Mõrva Katse',
            jail: 25,
            fine: 1875,
            color: 2,
        },
        {
            name: 'Teise Astme Mõrv',
            jail: 300,
            fine: 22500,
            color: 2,
        },
        {
            name: 'Esimese Astme Mõrva Katse',
            jail: 35,
            fine: 2625,
            color: 2,
        },
        {
            name: 'Riigiametniku Mõrva Katse',
            jail: 45,
            fine: 3375,
            color: 2,
        },
        {
            name: 'Gangi Seotud Tulistamine',
            jail: 75,
            fine: 500,
            color: 2,
        },
        {
            name: 'Ettekavatsemata Tapmine',
            jail: 150,
            fine: 11250,
            color: 3,
        },
        {
            name: 'Esimese Astme Mõrv',
            jail: 450,
            fine: 33500,
            color: 3,
        },
        {
            name: 'Riigiametniku Mõrv',
            jail: 600,
            fine: 45850,
            color: 3,
        },
        {
            name: 'Sarirünnakud ja Tapmised',
            jail: 99999,
            fine: 0,
            color: 3,
        },
    ],
    OffensesInvolvingVehicles: [
        {
            name: 'Hooletu Juhtimine',
            jail: 0,
            fine: 525,
            color: 1,
        },
        {
            name: 'Lõbusoit',
            jail: 5,
            fine: 800,
            color: 1,
        },

        {
            name: 'Kiiruseületamine 1-25 km/h',
            jail: 0,
            fine: 140,
            color: 1,
        },
        {
            name: 'Kiiruseületamine 25-40 km/h',
            jail: 0,
            fine: 280,
            color: 1,
        },
        {
            name: 'Kiiruseületamine 40-60 km/h',
            jail: 0,
            fine: 500,
            color: 1,
        },
        {
            name: 'Kiiruseületamine 60-100 km/h',
            jail: 0,
            fine: 950,
            color: 1,
        },
        {
            name: 'Kiiruseületamine 100+ km/h',
            jail: 7,
            fine: 1250,
            color: 2,
        },
        {
            name: 'Rünnak Sõidukiga',
            jail: 21,
            fine: 1575,
            color: 2,
        },
        {
            name: 'Hoolimatu Juhtimine',
            jail: 12,
            fine: 900,
            color: 2,
        },
    ],
    GeneralTrafficViolations: [
        {
            name: 'Liikusmärkide Eiramine',
            jail: 0,
            fine: 150,
            color: 1,
        },
        {
            name: 'Sobimatu Akna Toon',
            jail: 0,
            fine: 250,
            color: 1,
        },

        {
            name: 'Valel Pool Teed Sõitmine',
            jail: 0,
            fine: 300,
            color: 1,
        },
        {
            name: 'Ebaseaduslik Parkimine',
            jail: 0,
            fine: 500,
            color: 1,
        },
    ],
    OffensesInvolvingTheft: [
        {
            name: 'Pisivargus',
            jail: 0,
            fine: 250,
            color: 1,
        },
        {
            name: 'Autovargus',
            jail: 5,
            fine: 375,
            color: 1,
        },
        {
            name: 'Varastatud Kauba Vastuvõtmine',
            jail: 12,
            fine: 1300,
            color: 2,
        },
        {
            name: 'Sissemurdmine',
            jail: 13,
            fine: 1450,
            color: 2,
        },
        {
            name: 'Varastatud Kaupade Müümine',
            jail: 24,
            fine: 2600,
            color: 2,
        },
        {
            name: 'Röövimine',
            jail: 25,
            fine: 3000,
            color: 2,
        },
        {
            name: 'Esimese Astme Röövimine',
            jail: 35,
            fine: 3550,
            color: 3,
        },
    ],
    OffensesInvolvingDamageToProperty: [
        {
            name: 'Trespassing',
            jail: 0,
            fine: 400,
            color: 0,
        },
        {
            name: 'Felony Trespassing',
            jail: 12,
            fine: 900,
            color: 2,
        },
        {
            name: 'Süütamine',
            jail: 21,
            fine: 1575,
            color: 2,
        },
    ],
    OffensesInvolvingFraud: [
        {
            name: 'Pettus',
            jail: 15,
            fine: 1000,
            color: 2,
        },
        {
            name: 'Väljapressimine',
            jail: 15,
            fine: 1000,
            color: 2,
        },
        {
            name: 'Identiteedi Vargus',
            jail: 15,
            fine: 1500,
            color: 2,
        },
        {
            name: 'Altkäemaks',
            jail: 20,
            fine: 2000,
            color: 2,
        },
        {
            name: 'Rahapesu',
            jail: 30,
            fine: 2900,
            color: 2,
        },
    ],
    OffensesAgainstPublicSafety: [
        {
            name: 'Rahu Häirimine',
            jail: 0,
            fine: 375,
            color: 1,
        },
        {
            name: 'Vahistamisele Vastupanu Osutamine',
            jail: 5,
            fine: 700,
            color: 1,
        },
        {
            name: 'Taseri Kriminaalne Omamine',
            jail: 15,
            fine: 1575,
            color: 2,
        },
        {
            name: 'Tulirelva Kriminaalne Omamine',
            jail: 20,
            fine: 2150,
            color: 2,
        },
        {
            name: 'Terrorism',
            jail: 600,
            fine: 17850,
            color: 3,
        },
    ],
    OffensesAgainstPublicOrder: [
        {
            name: 'Riigiametniku Sõnakuulmatus',
            jail: 7,
            fine: 500,
            color: 1,
        },
        {
            name: 'Ahistamine',
            jail: 7,
            fine: 600,
            color: 1,
        },
        {
            name: 'Loomade Julmus',
            jail: 7,
            fine: 600,
            color: 1,
        },
        {
            name: 'Õigluse Takistamine',
            jail: 12,
            fine: 990,
            color: 1,
        },
    ],
    OffensesAgainstPublicHealth: [
        {
            name: 'Prostitutsioon',
            jail: 3,
            fine: 350,
            color: 1,
        },
        {
            name: 'Avalik Ebasündsus',
            jail: 5,
            fine: 500,
            color: 1,
        },
        {
            name: 'Illegaalsete Ainete Omamine',
            jail: 7,
            fine: 750,
            color: 1,
        },
        {
            name: 'Narkootikumide Müümine',
            jail: 25,
            fine: 2300,
            color: 2,
        },
    ],
}

const Option = (props) => {
    const { name, jail, fine, color, searchValue, onClick } = props

    let backgroundColor
    switch (color) {
        case 1:
            backgroundColor = 'var(--green)'
            break
        case 2:
            backgroundColor = 'var(--yellow)'
            break
        case 3:
            backgroundColor = 'var(--dark-red)'
            break
        default:
            backgroundColor = 'var(--green)'
            break
    }

    let canShow = searchValue
        ? name.toLowerCase().includes(searchValue.toLowerCase())
        : true

    return (
        <React.Fragment>
            {canShow && (
                <motion.div
                    whileHover={{
                        opacity: 0.7,
                        transition: { duration: 0.1 },
                    }}
                    style={{
                        cursor: 'pointer',
                        width: '320px',
                        height: 'auto',
                        margin: '2px',
                        backgroundColor,
                        fontSize: '14px',
                        fontFamily: 'Roboto',
                        ...props.style,
                    }}
                    onClick={() => onClick(name, jail, fine, color)}
                >
                    <div style={{ padding: '8px' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {name}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: '6px',
                            }}
                        >
                            <div>{jail} kuu(d)</div>
                            <div>{moneyFormatter.format(fine)}</div>
                        </div>
                    </div>
                </motion.div>
            )}
        </React.Fragment>
    )
}

const Category = ({ name, options, searchValue, addCharge }) => {
    const [show, setShow] = React.useState(true)
    React.useEffect(() => {
        for (let i = 0; i < options.length; i++) {
            if (
                options[i].name
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
            ) {
                setShow(true)
                return
            }
        }
        setShow(false)
    }, [searchValue])
    return (
        <div style={{ margin: '8px', display: show ? 'block' : 'none' }}>
            <div>{name}</div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    width: '100%',
                    flexWrap: 'wrap',
                    marginTop: '8px',
                }}
            >
                {options.map((option) => {
                    return (
                        <div>
                            <Option
                                {...option}
                                searchValue={searchValue}
                                onClick={addCharge}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const SearchBar = ({ searchValue, setSearchValue }) => {
    return (
        <div>
            <FormControl fullWidth>
                <InputLabel htmlFor="standard-adornment-amount">
                    Otsi
                </InputLabel>
                <Input
                    style={{ color: 'white' }}
                    value={searchValue}
                    onChange={(e) => {
                        setSearchValue(e.target.value)
                    }}
                />
            </FormControl>
        </div>
    )
}

const Page = (props) => {
    const { setCurrentProfile, currentProfile } = useProfileStore()

    const { searchValue, setSearchValue } = useChargesStore()

    const { charges, setCharges, finalString, setFinalString } =
        useChargesStore()
    const { reduction, setReduction } = useChargesStore()

    const getTotals = () => {
        let totalFine = charges.reduce(
            (total, charge) => total + charge.fine,
            0
        )

        let totalJail = charges.reduce(
            (total, charge) => total + charge.jail,
            0
        )

        if (reduction > 0) {
            const offset = reduction / 100
            totalJail = Math.round(totalJail * (1 - offset))
            totalFine = Math.round(totalFine + totalFine * offset)
        }

        return [totalFine, totalJail]
    }

    const updateFinesTotal = () => {
        const [totalFine, totalJail] = getTotals()

        setFinalString(
            `${totalJail} months | ${moneyFormatter.format(totalFine)} fine`
        )
    }

    React.useEffect(() => {
        updateFinesTotal()
    }, [charges, reduction])

    const addCharge = (name, jail, fine, color) => {
        setCharges([...charges, { name, jail, fine, color }])
    }

    const removeCharge = (name, index) => {
        let pCharges = [...charges]
        pCharges.splice(index, 1)
        setCharges(pCharges)
    }

    const chargePlayer = () => {
        const [totalFine, totalJail] = getTotals()
        props
            .doNuiAction(
                'chargePlayer',
                {
                    citizen_id: currentProfile.character_id,
                    charges: charges.map((x) => x.name),
                    totalFine,
                    totalJail,
                },
                true,
                false
            )
            .then((success) => {
                if (success) {
                    // RESET STUFF
                    setCharges([])
                    setCurrentProfile(false)
                    setReduction(0) // CHARGE REDUCTION AKA 10% / 25% / 50% ETC
                } else {
                    console.log('RIP FAILED?')
                }
            })
    }

    return (
        <div className="PageMain">
            {currentProfile ? (
                <React.Fragment>
                    <div
                        className="PageSectionContainer"
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            width: `${(7 / 10) * 100}%`,
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div>Lisa Süüdistusi</div>
                            <div>
                                <SearchBar
                                    searchValue={searchValue}
                                    setSearchValue={setSearchValue}
                                />
                            </div>
                        </div>
                        <div
                            style={{
                                backgroundColor: 'var(--dark)',
                                height: '100%',
                                marginTop: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                overflowY: 'scroll',
                            }}
                        >
                            <Category
                                name="Kuriteod Isikute Vastu"
                                options={ChargeOptions.OffensesAgainstPersons}
                                searchValue={searchValue}
                                addCharge={addCharge}
                            />

                            <Category
                                name="Kuriteod Seotud Sõidukitega"
                                options={
                                    ChargeOptions.OffensesInvolvingVehicles
                                }
                                searchValue={searchValue}
                                addCharge={addCharge}
                            />
                            <Category
                                name="Üldised Liiklusrikkumised"
                                options={ChargeOptions.GeneralTrafficViolations}
                                searchValue={searchValue}
                                addCharge={addCharge}
                            />
                            <Category
                                name="Kuriteod Seotud Vargusega"
                                options={ChargeOptions.OffensesInvolvingTheft}
                                searchValue={searchValue}
                                addCharge={addCharge}
                            />
                            <Category
                                name="Kuriteod Seotud Pettustega"
                                options={ChargeOptions.OffensesInvolvingFraud}
                                searchValue={searchValue}
                                addCharge={addCharge}
                            />
                            <Category
                                name="Kuriteod Seotud Avaliku Turvalisusega"
                                options={
                                    ChargeOptions.OffensesAgainstPublicSafety
                                }
                                searchValue={searchValue}
                                addCharge={addCharge}
                            />
                            <Category
                                name="Kuriteod Avaliku Korra Vastu"
                                options={
                                    ChargeOptions.OffensesAgainstPublicOrder
                                }
                                searchValue={searchValue}
                                addCharge={addCharge}
                            />
                            <Category
                                name="Kuriteod Rahvatervise Vastu"
                                options={
                                    ChargeOptions.OffensesAgainstPublicHealth
                                }
                                searchValue={searchValue}
                                addCharge={addCharge}
                            />
                        </div>
                    </div>
                    <div className="PageSectionPadding" />
                    <div
                        className="PageSectionContainer"
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            width: `${(3 / 10) * 100}%`,
                            overflowY: 'auto',
                        }}
                    >
                        <div>
                            {currentProfile?.character_name} (#
                            {currentProfile?.character_id})
                        </div>
                        <div
                            style={{
                                marginTop: '8px',
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexDirection: 'column',
                            }}
                        >
                            <div style={{ backgroundColor: 'var(--dark)' }}>
                                <div style={{ padding: '8px' }}>
                                    <div>
                                        Praegused Süüdistused ({charges.length})
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '14px',
                                            fontFamily: 'Roboto',
                                            height: '350px',
                                            overflowY: 'auto',
                                        }}
                                    >
                                        {charges.map((charge, index) => {
                                            return (
                                                <Option
                                                    {...charge}
                                                    style={{
                                                        margin: '0px',
                                                        marginTop: '4px',
                                                        width: '100%',
                                                    }}
                                                    onClick={() => {
                                                        removeCharge(
                                                            charge.name,
                                                            index
                                                        )
                                                    }}
                                                />
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div>
                                {charges.length > 0 && (
                                    <div>
                                        <div>Vähendused</div>
                                        <Select
                                            style={{ width: '100%' }}
                                            labelId="demo-simple-select-placeholder-label-label"
                                            value={reduction}
                                            onChange={(event) => {
                                                console.log(event.target.value)
                                                setReduction(event.target.value)
                                            }}
                                            displayEmpty
                                        >
                                            <MenuItem value={0} key={0}>
                                                0%
                                            </MenuItem>
                                            <MenuItem value={10} key={1}>
                                                10%
                                            </MenuItem>
                                            <MenuItem value={25} key={2}>
                                                25%
                                            </MenuItem>
                                            <MenuItem value={50} key={3}>
                                                50%
                                            </MenuItem>
                                        </Select>

                                        <div style={{ marginTop: '8px' }}>
                                            Total
                                        </div>
                                        <div>{finalString}</div>
                                        <Button
                                            style={{
                                                backgroundColor: 'var(--red)',
                                                width: '100%',
                                                marginTop: '16px',
                                            }}
                                            onClick={chargePlayer}
                                        >
                                            Karista
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            ) : (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    Profiili Pole Valitud (Vali Profiilide Lehelt)
                </div>
            )}
        </div>
    )
}

export default Page
