import React, { useState, Fragment, useCallback, useEffect } from 'react'
import './App.css'
import SpeciesChoice from './SpeciesChoice'
import Map from './Map'
import MapControls from './MapControls'
import { RegionFeature, StatsBySpecies, TimeStep } from './types'
import { Feature } from 'geojson'
import Timeseries from './Timeseries'
import { SPECIES_WHITELIST } from './constants_common'
import RegionStats from './RegionStats'
import SpeciesStats from './SpeciesStats'

function App() {
  const [timeStep, setTimeStep] = useState<TimeStep>('2005')
  const [species, setSpecies] = useState<string>(
    SPECIES_WHITELIST[Math.floor(SPECIES_WHITELIST.length * Math.random())]
  )
  const [region, setRegion] = useState<RegionFeature | null>(null)
  const [renderedFeatures, setRenderedFeatures] = useState<
    undefined | Feature[]
  >(undefined)

  const closeRegion = useCallback(() => {
    setRegion(null)
  }, [setRegion])

  const [stats, setStats] = useState<StatsBySpecies | null>(null)
  const [speciesDetail, setSpeciesDetail] = useState<any>(null)
  useEffect(() => {
    if (stats) return
    Promise.all(
      ['./stats.json', './species_detail.json'].map((url) =>
        fetch(url).then((resp) => resp.json())
      )
    ).then((data) => {
      const [stats, speciesDetail] = data
      setStats(stats)
      setSpeciesDetail(speciesDetail)
    })
  }, [stats])

  return !stats ? (
    <div>loading</div>
  ) : (
    <Fragment>
      {region ? (
        <RegionStats stats={stats} region={region} species={species} />
      ) : (
        <SpeciesStats
          stats={stats}
          species={species}
          speciesDetail={speciesDetail}
        />
      )}
      <Map
        timeStep={timeStep}
        species={species}
        region={region}
        onRegionChange={setRegion}
        onRenderedFeaturesChange={setRenderedFeatures}
      />
      <MapControls>
        <Timeseries
          timeStep={timeStep}
          onTimestepChange={setTimeStep}
          features={renderedFeatures}
          species={species}
        />
      </MapControls>
      <SpeciesChoice
        species={species}
        region={region}
        onSpeciesChange={setSpecies}
        onRegionClose={closeRegion}
      />
    </Fragment>
  )
}

export default App
