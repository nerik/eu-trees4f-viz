import React, {
  useCallback,
  useState,
  Fragment,
  ChangeEvent,
  useMemo,
  useRef,
} from 'react'
import './App.css'
import DeckGL from '@deck.gl/react/typed'
import { MapViewState } from '@deck.gl/core/typed'
import { BitmapLayer, IconLayer } from '@deck.gl/layers/typed'
import { TileLayer, MVTLayer } from '@deck.gl/geo-layers/typed'
import { CENTER, COLOR_BY_CELL_TYPE } from './constants'
import { Cell, TimeStep } from './types'
import type { Feature } from 'geojson'
import Timeseries from './Timeseries'
import { getCellTypeAtTimeStep } from './utils'
import BlobLayer from './BlobLayer'
import GL from '@luma.gl/constants'

const BLOB =
  'data:image/png;base64,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'

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: CENTER[0],
  latitude: CENTER[1],
  zoom: 3,
  // pitch: 30,
  bearing: 0,
}

const basemap = new TileLayer({
  data: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
  minZoom: 0,
  maxZoom: 19,
  tileSize: 256,

  renderSubLayers: (props) => {
    const {
      bbox: { west, south, east, north },
    } = props.tile as any

    return new BitmapLayer(props, {
      data: null,
      image: props.data,
      bounds: [west, south, east, north],
    })
  },
})

const isLocal = window.location.hostname === 'localhost'
const baseTilesURL = isLocal
  ? '//localhost:9090/'
  : '//storage.googleapis.com/eu-trees4f-tiles/pbf'

function App() {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE)

  const [timeStep, setTimeStep] = useState<TimeStep>('2005')
  const onTimestepChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTimeStep(e.target.value.toString() as TimeStep)
  }, [])

  const [species, setSpecies] = useState<string>('Fraxinus_excelsior')
  const onSpeciesChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setSpecies(e.target.value)
  }, [])

  const [tilesZoom, setTilesZoom] = useState(viewState.zoom)
  const gridLayer = useMemo(
    () =>
      new MVTLayer({
        data: `${baseTilesURL}/${species}/{z}/{x}/{y}.pbf`,
        minZoom: 0,
        maxZoom: 8,
        pickable: true,
        binary: false,
        // pointType: 'circle',
        // getPointRadius: () => {
        //   if (tilesZoom <= 2) {
        //     return 20000
        //   } else if (tilesZoom >= 3 && tilesZoom <= 4) {
        //     return 10000
        //   } else if (tilesZoom >= 5 && tilesZoom <= 6) {
        //     return 5000
        //   } else if (tilesZoom >= 6) {
        //     return 2500
        //   }
        // },
        // getFillColor: (d: Cell) => {
        //   return COLOR_BY_CELL_TYPE[getCellTypeAtTimeStep(d, timeStep)]
        // },
        updateTriggers: {
          // This tells deck.gl to recalculate fill color when `timeStep` changes
          getColor: timeStep,
          getSize: [tilesZoom, timeStep],
        },
        onViewportLoad: (tiles) => {
          if (tiles && tiles[0] && tiles[0].zoom !== tilesZoom) {
            setTilesZoom(tiles[0].zoom)
          }
        },
        renderSubLayers: (props) => {
          const ICON_MAPPING = {
            marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
          }
          return new BlobLayer({
            ...props,
            iconAtlas: BLOB,
            iconMapping: ICON_MAPPING,
            getIcon: () => 'marker',

            sizeScale: 5,
            getPosition: (d: any) => {
              return d.geometry.coordinates
              // return d.coordinates
            },
            getSize: (d) => {
              let baseSize
              if (tilesZoom <= 2) {
                baseSize = 2
              } else if (tilesZoom >= 3 && tilesZoom <= 4) {
                baseSize = 1
              } else if (tilesZoom >= 5 && tilesZoom <= 6) {
                baseSize = 5
              } else if (tilesZoom >= 6) {
                baseSize = 2.5
              } else {
                baseSize = 5
              }
              return baseSize + baseSize * 0.5 * Math.random()
            },
            getColor: (d: any) => {
              return COLOR_BY_CELL_TYPE[
                getCellTypeAtTimeStep(d, timeStep)
              ] as any
            },
            // updateTriggers: {
            //   // This tells deck.gl to recalculate fill color when `timeStep` changes
            //   getColor: timeStep,
            //   getSize: tilesZoom,
            // },
            // parameters: {
            //   //   // prevent flicker from z-fighting
            //   [GL.DEPTH_TEST]: false,
            //   //   // turn on additive blending to make them look more glowy
            //   [GL.BLEND]: true,
            //   [GL.BLEND_SRC_RGB]: GL.ONE,
            //   [GL.BLEND_DST_RGB]: GL.ONE,
            //   [GL.BLEND_EQUATION]: GL.FUNC_ADD,
            // },
            transitions: {
              getColor: 1000,
              getSize: {
                duration: 1000,
                enter: (value: number) => [value, 0],
              },
            },
          })
        },
      }),
    [timeStep, species, tilesZoom]
  )

  const layers = [basemap, gridLayer]

  const timeoutId = useRef<undefined | ReturnType<typeof setTimeout>>(undefined)
  const [renderedFeatures, setRenderedFeatures] = useState<
    undefined | Feature[]
  >(undefined)
  const onViewStateChange = useCallback(
    ({ viewState }: { viewState: MapViewState }) => {
      setViewState(viewState)
      if (timeoutId.current) clearTimeout(timeoutId.current)
      timeoutId.current = setTimeout(() => {
        try {
          setRenderedFeatures(gridLayer.getRenderedFeatures())
        } catch (e) {
          console.log(e)
        }
      }, 100)
    },
    [gridLayer]
  )

  const deckRef = useRef(null)

  return (
    <Fragment>
      <DeckGL
        ref={deckRef}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        viewState={viewState}
        onViewStateChange={onViewStateChange as any}
        layers={layers}
      />
      <div className="ui">
        {tilesZoom}
        <div>
          <label htmlFor="species">Species:</label>
          <select name="species" id="species" onChange={onSpeciesChange}>
            <option value="Fraxinus_excelsior">Fraxinus Excelsior</option>
            <option value="Quercus_ilex">Quercus Ilex</option>
          </select>
        </div>
        <input
          type="range"
          list="tickmarks"
          min="2005"
          max="2095"
          step="30"
          onChange={onTimestepChange}
          value={timeStep}
        ></input>
        <datalist id="tickmarks">
          <option value="2005" label="2005"></option>
          <option value="2035" label="2035"></option>
          <option value="2065" label="2065"></option>
          <option value="2095" label="2095"></option>
        </datalist>
        {timeStep}
      </div>
      <div className="timeseries">
        <Timeseries features={renderedFeatures} />
      </div>
    </Fragment>
  )
}

export default App
