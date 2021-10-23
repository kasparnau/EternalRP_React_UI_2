import { create, reset } from './zustandWrapper'
const IS_PROD = process.env.NODE_ENV === 'production'

let mainStore = (set) => ({
    character: IS_PROD ? {} : debugCharacter,
    setCharacter: (pCharacter) => set((state) => ({ character: pCharacter })),
})

export const useMainStore = create(mainStore)

let profileStore = (set) => ({
    currentCharacterId: 0,
    changeCurrentCharacterId: (currentCharacterId) =>
        set((state) => ({ currentCharacterId })),

    currentProfile: null,
    setCurrentProfile: (currentProfile) => set((state) => ({ currentProfile })),

    searchBarValue: '',
    setSearchBarValue: (searchBarValue) => set((state) => ({ searchBarValue })),
    profileRows: [],
    setProfileRows: (profileRows) => set((state) => ({ profileRows })),

    currentProfileImageURL: '',
    setCurrentProfileImageURL: (currentProfileImageURL) =>
        set((state) => ({ currentProfileImageURL })),

    editorState: '',
    setEditorState: (editorState) => set((state) => ({ editorState })),
})

export const useProfileStore = create(profileStore)

let dashboardStore = (set) => ({
    bulletins: [],
    setBulletins: (bulletins) => set((state) => ({ bulletins })),
    warrants: [],
    setWarrants: (warrants) => set((state) => ({ warrants })),
})

export const useDashboardStore = create(dashboardStore)

let vehicleStore = (set) => ({
    vehicleResults: [],
    setVehicleResults: (vehicleResults) => set((state) => ({ vehicleResults })),

    currentVehicle: null,
    setCurrentVehicle: (currentVehicle) => set((state) => ({ currentVehicle })),

    searchBarValue: '',
    setSearchBarValue: (searchBarValue) => set((state) => ({ searchBarValue })),
})

export const useVehicleStore = create(vehicleStore)

let chargesStore = (set) => ({
    searchValue: '',
    setSearchValue: (searchValue) => set((state) => ({ searchValue })),

    charges: [],
    setCharges: (charges) => set((state) => ({ charges })),

    finalString: '',
    setFinalString: (finalString) => set((state) => ({ finalString })),

    reduction: 0,
    setReduction: (reduction) => set((state) => ({ reduction })),
})

export const useChargesStore = create(chargesStore)

export const resetState = () => {
    reset()
}
