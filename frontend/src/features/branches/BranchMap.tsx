import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import './BranchMap.css'

import type { Branch } from './branches'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

interface BranchMapProps {
  branches: Branch[]
  selectedBranch: Branch | null
}

function MapViewport({
  branches,
  selectedBranch,
}: {
  branches: Branch[]
  selectedBranch: Branch | null
}) {
  const map = useMap()

  useEffect(() => {
    if (selectedBranch) {
      map.flyTo(
        [selectedBranch.lat, selectedBranch.lng],
        12,
        { duration: 1 }
      )
      return
    }

    if (branches.length === 0) return

    if (branches.length === 1) {
      map.flyTo(
        [branches[0].lat, branches[0].lng],
        11,
        { duration: 1 }
      )
      return
    }

    const positions: [number, number][] = branches.map(
      (branch) => [branch.lat, branch.lng]
    )

    map.flyToBounds(positions, {
      padding: [40, 40],
      maxZoom: 11,
      duration: 1,
    })
  }, [branches, selectedBranch, map])

  return null
}

export default function BranchMap({
  branches,
  selectedBranch,
}: BranchMapProps) {
  return (
    <div className="branch-map-wrapper">
      <MapContainer
        center={[20.5, -101.5]}
        zoom={6}
        scrollWheelZoom={false}
        className="branch-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewport
          branches={branches}
          selectedBranch={selectedBranch}
        />
        {branches.map((branch) => (
          <CircleMarker
            key={branch.id}
            center={[branch.lat, branch.lng]}
            radius={7}
            pathOptions={{
              color: '#ffffff',
              weight: 2,
              fillColor: '#c92f3b',
              fillOpacity: 1,
            }}
          >
            <Popup>
              <div className="branch-map-popup">
                <strong>{branch.name}</strong>

                <p>{branch.location}</p>

                <span>{branch.state}</span>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cómo llegar ↗
                </a>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}