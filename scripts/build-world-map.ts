// One-off generator for public/world-110m.svg, the backdrop of the admin map.
//
// Input is world-atlas' land-110m TopoJSON, derived from Natural Earth (public
// domain). Decoding it here rather than at runtime means the dashboard ships a
// plain SVG and needs no mapping library. The projection is equirectangular, so
// the dashboard can place a point with x = (lon + 180) / 360 and
// y = (90 - lat) / 180 without reimplementing any projection maths.
//
// Usage: node scripts/build-world-map.ts <land-110m.json> <out.svg>

import { readFileSync, writeFileSync } from 'node:fs'
import { argv, exit } from 'node:process'

const WIDTH = 2000
const HEIGHT = 1000

interface Topology {
  transform?: { scale: [number, number]; translate: [number, number] }
  arcs: number[][][]
  objects: Record<string, TopoObject>
}

type TopoObject =
  | { type: 'GeometryCollection'; geometries: TopoObject[] }
  | { type: 'Polygon'; arcs: number[][] }
  | { type: 'MultiPolygon'; arcs: number[][][] }

/** TopoJSON stores arcs delta-encoded against a quantisation grid. */
function decodeArcs(topology: Topology): [number, number][][] {
  const { scale, translate } = topology.transform ?? { scale: [1, 1], translate: [0, 0] }
  return topology.arcs.map(arc => {
    let x = 0
    let y = 0
    return arc.map(([dx, dy]) => {
      x += dx
      y += dy
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]] as [number, number]
    })
  })
}

function project([lon, lat]: [number, number]): [number, number] {
  return [((lon + 180) / 360) * WIDTH, ((90 - lat) / 180) * HEIGHT]
}

/**
 * One subpath per ring. Emitting a polygon's outer ring and its holes as a
 * single subpath would draw a seam between them; keeping them separate lets
 * fill-rule evenodd punch the holes out instead.
 */
function polygonToPath(rings: number[][], decoded: [number, number][][]): string {
  return rings
    .map(ring => {
      const points: [number, number][] = []
      for (const index of ring) {
        // A negative index means the arc is traversed backwards, ~index being its position.
        const arc = index < 0 ? [...decoded[~index]].reverse() : decoded[index]
        // Arcs share endpoints, so drop the duplicated joint.
        points.push(...(points.length > 0 ? arc.slice(1) : arc))
      }
      if (points.length === 0) return ''

      // A ring that crosses the antimeridian jumps the full width of the map, so
      // break it there rather than drawing a streak from one edge to the other.
      const segments: string[][] = []
      let previousX: number | null = null
      for (const point of points) {
        const [x, y] = project(point)
        if (previousX === null || Math.abs(x - previousX) > WIDTH / 2) segments.push([])
        segments[segments.length - 1].push(`${x.toFixed(1)},${y.toFixed(1)}`)
        previousX = x
      }
      return segments
        .filter(segment => segment.length > 1)
        .map(segment => `M${segment.join('L')}Z`)
        .join('')
    })
    .join('')
}

function collectPolygons(object: TopoObject, out: number[][][]): void {
  if (object.type === 'GeometryCollection') {
    for (const child of object.geometries) collectPolygons(child, out)
  } else if (object.type === 'Polygon') {
    out.push(object.arcs)
  } else if (object.type === 'MultiPolygon') {
    for (const polygon of object.arcs) out.push(polygon)
  }
}

function main(): void {
  const [input, output] = argv.slice(2)
  if (!input || !output) {
    console.error('usage: node scripts/build-world-map.ts <land-110m.json> <out.svg>')
    exit(1)
  }

  const topology = JSON.parse(readFileSync(input, 'utf-8')) as Topology
  const decoded = decodeArcs(topology)
  const polygons: number[][][] = []
  for (const object of Object.values(topology.objects)) collectPolygons(object, polygons)

  const path = polygons.map(polygon => polygonToPath(polygon, decoded)).join('')
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}">` +
    `<title>World land, equirectangular</title>` +
    `<path d="${path}" fill="currentColor" fill-rule="evenodd"/>` +
    `</svg>\n`

  writeFileSync(output, svg)
  console.info(`wrote ${output}: ${polygons.length} polygons, ${(svg.length / 1024).toFixed(0)}KB`)
}

main()
