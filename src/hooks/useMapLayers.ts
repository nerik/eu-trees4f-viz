import { PickingInfo } from '@deck.gl/core/typed'
import { BitmapLayer } from '@deck.gl/layers/typed'
import {
  TileLayer,
  TileLayerProps,
  MVTLayer,
  MVTLayerProps,
} from '@deck.gl/geo-layers/typed'
import {
  BASEMAP_COUNTRIES,
  BASEMAP_REGIONS,
  COUNTRIES_WITHOUT_REGIONS,
} from '../constants_common'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { Cell, LayerGenerator, RegionFeature, TimeStep } from '../types'
import { getCellTypeAtTimeStep } from '../utils'
import { COLOR_BY_CELL_TYPE, SPECIES_COLORS } from '../constants'

const isLocal = window.location.hostname === 'localhost'
const baseTilesURL = isLocal
  ? '//localhost:9090/'
  : '//storage.googleapis.com/eu-trees4f-tiles/pbf'

const LABELS: LayerGenerator = {
  config: {
    id: 'labels',
    data: 'https://a.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}@2x.png ',
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
      }) as any
    },
  } as TileLayerProps,
}

const BASE_ZOOM_CONFIG = {
  minZoom: 0,
  maxZoom: 8,
}

const BASE_REGIONS_CONFIG = {
  ...BASE_ZOOM_CONFIG,
  getLineColor: [192, 192, 192],
  pickable: true,
}

const COUNTRIES: LayerGenerator = {
  config: {
    ...BASE_REGIONS_CONFIG,
    id: 'countries',
    data: `${baseTilesURL}/${BASEMAP_COUNTRIES}/{z}/{x}/{y}.pbf`,
    getFillColor: [0, 30, 0],
  } as MVTLayerProps,
  overrides: {
    getLineWidth: [1000, 2000],
  },
}

const REGIONS: LayerGenerator = {
  config: {
    ...BASE_REGIONS_CONFIG,
    id: 'regions',
    data: `${baseTilesURL}/${BASEMAP_REGIONS}/{z}/{x}/{y}.pbf`,
    getFillColor: [0, 0, 0, 0],
  } as MVTLayerProps,
  overrides: {
    getLineWidth: [500, 2000],
  },
}

const GRID: LayerGenerator = {
  config: {
    ...BASE_ZOOM_CONFIG,
    // pickable: true,
    binary: false,
    pointType: 'circle',
  } as MVTLayerProps,
  overrides: {
    data: (species: string) => `${baseTilesURL}/${species}/{z}/{x}/{y}.pbf`,
    getPointRadiusByZoom: (zoom: number) => {
      if (zoom <= 2) {
        return 20000
      } else if (zoom >= 3 && zoom <= 4) {
        return 10000
      } else if (zoom >= 5 && zoom <= 6) {
        return 5000
      } else if (zoom >= 6) {
        return 2500
      }
    },
    getFillColor: (d: Cell, timeStep: TimeStep, species: string) => {
      const type = getCellTypeAtTimeStep(d, timeStep)
      if (type === 'stable') return SPECIES_COLORS[species]
      return COLOR_BY_CELL_TYPE[getCellTypeAtTimeStep(d, timeStep)]
    },
  },
}

type UseMapLayerProps = {
  timeStep: TimeStep
  species: string
  onRegionChange: Dispatch<SetStateAction<RegionFeature | null>>
}

function useMapLayers({ timeStep, species, onRegionChange }: UseMapLayerProps) {
  const [tilesZoom, setTilesZoom] = useState(3)
  const [hoveredRegionId, setHoveredRegionId] = useState<number | null>(null)

  return useMemo(() => {
    const labels = new TileLayer(LABELS.config)

    const countries = new MVTLayer({
      ...COUNTRIES.config,
      getLineWidth: (d: any) => {
        return d.properties?.fid === hoveredRegionId
          ? COUNTRIES.overrides.getLineWidth[1]
          : COUNTRIES.overrides.getLineWidth[0]
      },
      onClick: (o: PickingInfo) => {
        if (COUNTRIES_WITHOUT_REGIONS.includes(o.object.properties.COUNTRY)) {
          onRegionChange({
            ...o.object,
            properties: {
              ...o.object.properties,
              name_en: o.object.properties.COUNTRY,
            },
          })
        }
      },
      onHover: (o: PickingInfo) => {
        if (o.object?.properties.fid) {
          setHoveredRegionId(o.object?.properties.fid)
        }
      },
      updateTriggers: {
        getLineWidth: hoveredRegionId,
      },
    } as Omit<MVTLayerProps, 'TilesetClass'>)

    const regions = new MVTLayer({
      ...REGIONS.config,
      getLineWidth: (d: any) => {
        return d.properties?.fid === hoveredRegionId
          ? REGIONS.overrides.getLineWidth[1]
          : REGIONS.overrides.getLineWidth[0]
      },
      onClick: (o: PickingInfo) => {
        onRegionChange({
          ...o.object,
          properties: {
            ...o.object.properties,
            name_en: o.object.properties.NAME_1,
            name_fr: o.object.properties.NAME_1,
          },
        })
      },
      onHover: (o: PickingInfo) => {
        if (o.object?.properties.fid) {
          setHoveredRegionId(o.object?.properties.fid)
        }
      },
      updateTriggers: {
        getLineWidth: hoveredRegionId,
      },
    } as Omit<MVTLayerProps, 'TilesetClass'>)

    const grid = new MVTLayer({
      ...GRID.config,
      data: GRID.overrides.data(species),
      getPointRadius: GRID.overrides.getPointRadiusByZoom(tilesZoom),
      getFillColor: (d) => GRID.overrides.getFillColor(d, timeStep, species),
      updateTriggers: {
        getPointRadius: tilesZoom,
        getFillColor: timeStep,
      },
      onViewportLoad: (tiles) => {
        if (tiles && tiles[0] && tiles[0].zoom !== tilesZoom) {
          setTilesZoom(tiles[0].zoom)
        }
      },
    } as Omit<MVTLayerProps, 'TilesetClass'>)

    return {
      layers: [countries, labels, regions, grid],
      countries,
      regions,
      grid,
    }
  }, [
    species,
    timeStep,
    tilesZoom,
    onRegionChange,
    hoveredRegionId,
    setHoveredRegionId,
  ])
}

export default useMapLayers