import './App.css'
import React, { useState } from 'react'

import { useProfileStore, useChargesStore } from './store'
import {
    Button,
    Chip,
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
            name: 'Brandishing of a Firearm',
            jail: 7,
            fine: 525,
            color: 1,
        },

        {
            name: 'Assault & Battery',
            jail: 11,
            fine: 825,
            color: 1,
        },
        {
            name: 'Unlawful Imprisonment',
            jail: 11,
            fine: 825,
            color: 1,
        },
        {
            name: 'Reckless Endangerment',
            jail: 11,
            fine: 825,
            color: 1,
        },
        {
            name: 'Criminal Threats',
            jail: 14,
            fine: 1050,
            color: 1,
        },
        {
            name: 'Kidnapping',
            jail: 15,
            fine: 1050,
            color: 2,
        },
        {
            name: 'Kidnapping a Government Employee',
            jail: 30,
            fine: 3500,
            color: 2,
        },
        {
            name: 'Assault with a Deadly Weapon',
            jail: 21,
            fine: 1575,
            color: 2,
        },
        {
            name: 'Attempted 2nd Degree Murder',
            jail: 25,
            fine: 1875,
            color: 2,
        },
        {
            name: '2nd Degree Murder',
            jail: 300,
            fine: 22500,
            color: 2,
        },
        {
            name: 'Attempted 1st Degree Murder',
            jail: 35,
            fine: 2625,
            color: 2,
        },
        {
            name: 'Attempted Murder of a Government Employee',
            jail: 45,
            fine: 3375,
            color: 2,
        },
        {
            name: 'Gang Related Shooting',
            jail: 75,
            fine: 500,
            color: 2,
        },
        {
            name: 'Manslaughter',
            jail: 150,
            fine: 11250,
            color: 3,
        },
        {
            name: '1st Degree Murder',
            jail: 450,
            fine: 33500,
            color: 3,
        },
        {
            name: 'Murder of a Government Employee',
            jail: 600,
            fine: 45850,
            color: 3,
        },
        {
            name: 'Serial Assaults and Killings',
            jail: 99999,
            fine: 0,
            color: 3,
        },
    ],
    OffensesInvolvingVehicles: [
        {
            name: 'Negligent Driving',
            jail: 0,
            fine: 525,
            color: 1,
        },
        {
            name: 'Joyriding',
            jail: 5,
            fine: 800,
            color: 1,
        },

        {
            name: 'Speeding 1-25 km/h',
            jail: 0,
            fine: 140,
            color: 1,
        },
        {
            name: 'Speeding 25-40 km/h',
            jail: 0,
            fine: 280,
            color: 1,
        },
        {
            name: 'Speeding 40-60 km/h',
            jail: 0,
            fine: 500,
            color: 1,
        },
        {
            name: 'Speeding 60-100 km/h',
            jail: 0,
            fine: 950,
            color: 1,
        },
        {
            name: 'Speeding 100+ km/h',
            jail: 7,
            fine: 1250,
            color: 2,
        },
        {
            name: 'Vehicular Assault',
            jail: 21,
            fine: 1575,
            color: 2,
        },
        {
            name: 'Reckless Driving',
            jail: 12,
            fine: 900,
            color: 2,
        },
    ],
    GeneralTrafficViolations: [
        {
            name: 'Failure to Obey Traffic Control Devices',
            jail: 0,
            fine: 150,
            color: 1,
        },
        {
            name: 'Improper Window Tint',
            jail: 0,
            fine: 250,
            color: 1,
        },

        {
            name: 'Driving on the Wrong Side of the Road',
            jail: 0,
            fine: 300,
            color: 1,
        },
        {
            name: 'Unauthorized Parking',
            jail: 0,
            fine: 500,
            color: 1,
        },
    ],
    OffensesInvolvingTheft: [
        {
            name: 'Petty Theft',
            jail: 0,
            fine: 250,
            color: 1,
        },
        {
            name: 'Grand Theft Auto',
            jail: 5,
            fine: 375,
            color: 1,
        },
        {
            name: 'Receiving Stolen Goods',
            jail: 12,
            fine: 1300,
            color: 2,
        },
        {
            name: 'Burglary',
            jail: 13,
            fine: 1450,
            color: 2,
        },
        {
            name: 'Sale of Stolen Goods',
            jail: 24,
            fine: 2600,
            color: 2,
        },
        {
            name: 'Robbery',
            jail: 25,
            fine: 3000,
            color: 2,
        },
        {
            name: 'First Degree Robbery',
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
            name: 'Arson',
            jail: 21,
            fine: 1575,
            color: 2,
        },
    ],
    OffensesInvolvingFraud: [
        {
            name: 'Fraud',
            jail: 15,
            fine: 1000,
            color: 2,
        },
        {
            name: 'Extortion',
            jail: 15,
            fine: 1000,
            color: 2,
        },
        {
            name: 'Identity Theft',
            jail: 15,
            fine: 1500,
            color: 2,
        },
        {
            name: 'Bribery',
            jail: 20,
            fine: 2000,
            color: 2,
        },
        {
            name: 'Money Laundering',
            jail: 30,
            fine: 2900,
            color: 2,
        },
    ],
    OffensesAgainstPublicSafety: [
        {
            name: 'Disturbing the peace',
            jail: 0,
            fine: 375,
            color: 1,
        },
        {
            name: 'Disorderly Conduct',
            jail: 0,
            fine: 500,
            color: 1,
        },
        {
            name: 'Resisting Arrest',
            jail: 5,
            fine: 700,
            color: 1,
        },
        {
            name: 'Criminal Possession of a Taser',
            jail: 15,
            fine: 1575,
            color: 2,
        },
        {
            name: 'Criminal Possession of a Firearm',
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
            name: 'Disobeying a Peace Officer',
            jail: 7,
            fine: 500,
            color: 1,
        },
        {
            name: 'Harrassment',
            jail: 7,
            fine: 600,
            color: 1,
        },
        {
            name: 'Animal Cruelty',
            jail: 7,
            fine: 600,
            color: 1,
        },
        {
            name: 'Obstruction of Justice',
            jail: 12,
            fine: 990,
            color: 1,
        },
    ],
    OffensesAgainstPublicHealth: [
        {
            name: 'Prostitution',
            jail: 3,
            fine: 350,
            color: 1,
        },
        {
            name: 'Public Indecency',
            jail: 5,
            fine: 500,
            color: 1,
        },
        {
            name: 'Possession of Controlled Dangerous Substances',
            jail: 7,
            fine: 750,
            color: 1,
        },
        {
            name: 'Desecration of a Human Corpse',
            jail: 18,
            fine: 1500,
            color: 2,
        },
        {
            name: 'Sale of Drugs',
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
                            <div>{jail} month(s)</div>
                            <div>{moneyFormatter.format(fine)}</div>
                        </div>
                    </div>
                </motion.div>
            )}
        </React.Fragment>
    )
}

const Category = ({ name, options, searchValue, addCharge }) => {
    return (
        <div style={{ margin: '8px' }}>
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
                    Charge
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
    const { currentProfile } = useProfileStore()

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
                    console.log('YAY')

                    // RESET STUFF
                    setCharges([])
                    setReduction(0)
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
                            <div>Add Charges</div>
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
                                name="Offenses Against Persons"
                                options={ChargeOptions.OffensesAgainstPersons}
                                searchValue={searchValue}
                                addCharge={addCharge}
                            />

                            <Category
                                name="Offenses Involving Vehicles"
                                options={
                                    ChargeOptions.OffensesInvolvingVehicles
                                }
                                searchValue={searchValue}
                                addCharge={addCharge}
                            />
                            <Category
                                name="General Traffic Violations/Citations"
                                options={ChargeOptions.GeneralTrafficViolations}
                                searchValue={searchValue}
                                addCharge={addCharge}
                            />
                            <Category
                                name="Offenses Involving Theft"
                                options={ChargeOptions.OffensesInvolvingTheft}
                                searchValue={searchValue}
                                addCharge={addCharge}
                            />
                            <Category
                                name="Offenses Involving Fraud"
                                options={ChargeOptions.OffensesInvolvingFraud}
                                searchValue={searchValue}
                                addCharge={addCharge}
                            />
                            <Category
                                name="Offenses Against Public Safety"
                                options={
                                    ChargeOptions.OffensesAgainstPublicSafety
                                }
                                searchValue={searchValue}
                                addCharge={addCharge}
                            />
                            <Category
                                name="Offenses Against Public Order"
                                options={
                                    ChargeOptions.OffensesAgainstPublicOrder
                                }
                                searchValue={searchValue}
                                addCharge={addCharge}
                            />
                            <Category
                                name="Offenses Against Public Health"
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
                                backgroundColor: 'var(--dark)',
                                marginTop: '8px',
                                padding: '8px',
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexDirection: 'column',
                            }}
                        >
                            <div>
                                <div>Current Charges ({charges.length})</div>
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
                            <div>
                                {charges.length > 0 && (
                                    <div>
                                        <div>Reductions</div>
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
                                            Final
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
                                            Charge
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
                    No Profile Selected (Select one from the Profiles tab)
                </div>
            )}
        </div>
    )
}

export default Page
