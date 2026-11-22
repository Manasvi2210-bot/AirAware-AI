declare module 'leaflet' {
  export interface IconOptions {
    iconUrl?: string;
    iconRetinaUrl?: string;
    iconSize?: [number, number];
    iconAnchor?: [number, number];
    popupAnchor?: [number, number];
    shadowUrl?: string;
    shadowSize?: [number, number];
    shadowAnchor?: [number, number];
    className?: string;
    html?: string;
  }

  export class DivIcon {
    constructor(options?: IconOptions);
  }

  export class Icon {
    constructor(options?: IconOptions);
    static Default: {
      imagePath?: string;
      prototype: any;
    };
  }

  export function divIcon(options?: IconOptions): DivIcon;
  export function icon(options?: IconOptions): Icon;

  export interface LatLngExpression {
    lat: number;
    lng: number;
  }

  export interface MapOptions {
    center?: [number, number] | LatLngExpression;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    zoomControl?: boolean;
    attributionControl?: boolean;
  }

  export class Layer {
    addTo(map: Map): this;
    remove(): this;
  }

  export class Marker extends Layer {
    bindPopup(content: string | HTMLElement, options?: any): this;
    openPopup(): this;
    closePopup(): this;
    setLatLng(latlng: [number, number] | LatLngExpression): this;
    on(event: string, fn: Function): this;
  }

  export function marker(latlng: [number, number] | LatLngExpression, options?: any): Marker;

  export class TileLayer extends Layer {
    addTo(map: Map): this;
  }

  export function tileLayer(urlTemplate: string, options?: any): TileLayer;

  export class CircleMarker extends Layer {
    bindPopup(content: string | HTMLElement, options?: any): this;
    setLatLng(latlng: [number, number] | LatLngExpression): this;
    setStyle(style: any): this;
    on(event: string, fn: Function): this;
  }

  export function circleMarker(latlng: [number, number] | LatLngExpression, options?: any): CircleMarker;

  export class Map {
    constructor(element: string | HTMLElement, options?: MapOptions);
    setView(center: [number, number] | LatLngExpression, zoom?: number): this;
    remove(): this;
    invalidateSize(): this;
    on(event: string, fn: Function): this;
  }

  export function map(element: string | HTMLElement, options?: MapOptions): Map;

  namespace L {
    export type { Map, Layer, Marker, TileLayer, CircleMarker, IconOptions, LatLngExpression, MapOptions };
    export { map, tileLayer, marker, circleMarker, divIcon, icon, Icon, DivIcon };
  }

  export default L;
}
