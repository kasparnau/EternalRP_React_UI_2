import * as React from 'react'
import { Paper, Popper, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { GridCellParams, isOverflown } from '@material-ui/data-grid'

interface CellExpandProps {
    value: string
    width: number
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            alignItems: 'center',
            lineHeight: '24px',
            width: '100%',
            height: '100%',
            position: 'relative',
            display: 'flex',
            '& .cellValue': {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            },
        },
    })
)
const CellExpand = React.memo(function CellExpand(props: CellExpandProps) {
    const { width, value } = props
    const wrapper = React.useRef<HTMLDivElement | null>(null)
    const cellDiv = React.useRef(null)
    const cellValue = React.useRef(null)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const classes = useStyles()
    const [showFullCell, setShowFullCell] = React.useState(false)
    const [showPopper, setShowPopper] = React.useState(false)

    const handleMouseEnter = () => {
        const isCurrentlyOverflown = isOverflown(cellValue.current!)
        setShowPopper(isCurrentlyOverflown)
        setAnchorEl(cellDiv.current)
        setShowFullCell(true)
    }

    const handleMouseLeave = () => {
        setShowFullCell(false)
    }

    React.useEffect(() => {
        if (!showFullCell) {
            return undefined
        }

        function handleKeyDown(nativeEvent: KeyboardEvent) {
            // IE11, Edge (prior to using Bink?) use 'Esc'
            if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
                setShowFullCell(false)
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [setShowFullCell, showFullCell])

    return (
        <div
            ref={wrapper}
            className={classes.root}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={cellDiv}
                style={{
                    height: 1,
                    width,
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                }}
            />
            <div ref={cellValue} className="cellValue">
                {value}
            </div>
            {showPopper && (
                <Popper
                    open={showFullCell && anchorEl != null}
                    anchorEl={anchorEl}
                    style={{ width, marginLeft: -17 }}
                >
                    <Paper
                        elevation={1}
                        style={{ minHeight: wrapper.current!.offsetHeight - 3 }}
                    >
                        <Typography variant="body2" style={{ padding: 8 }}>
                            {value}
                        </Typography>
                    </Paper>
                </Popper>
            )}
        </div>
    )
})

export function renderCellExpand(params: GridCellParams) {
    return (
        <CellExpand
            value={params.value ? params.value.toString() : ''}
            width={params.colDef.width}
        />
    )
}
