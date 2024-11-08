import { cn } from '@/lib/utils'
import { CombinedMarker } from '@buzztrip/db/types'
import { InfoWindow, InfoWindowProps} from '@vis.gl/react-google-maps'
import React from 'react'

interface InfoBoxProps extends InfoWindowProps {
    activeLocation: CombinedMarker
}

/**
 * An info box that can be placed on a map.
 */
const InfoBox = ({activeLocation, ...props}: InfoBoxProps) => {
    const handleClose = () => {

    }


  return (
    <InfoWindow onClose={handleClose} className={cn('', props.className)} {...props}>
        
    </InfoWindow>
  )
}

export default InfoBox