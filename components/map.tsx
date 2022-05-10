import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { HeatmapLayer, CircleLayer, Layer, Popup, Source, MarkerDragEvent, Marker } from 'react-map-gl';
import axios from 'axios';
import { Component, useEffect, useMemo, useState } from 'react';
import Pin from '../components/pin';

interface ITweetPoint {
	longitude: any;
	latitude: any;
	score: number;
	id: string;
}

/**
 * Style for the heatmap layer
 */
const heatmapLayerStyle: HeatmapLayer = {
	id: 'heatmap-heat',
	type: 'heatmap',
	maxzoom: 9,
	paint: {
		'heatmap-weight': ['interpolate', ['linear'], ['get', 'score'], 0, 0, 6, 1],
		'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 10, 3],
		'heatmap-color': [
			'interpolate',
			['linear'],
			['heatmap-density'],
			0,
			'rgba(33,102,172,0)',
			0.2,
			'rgb(103,169,207)',
			0.4,
			'rgb(209,229,240)',
			0.6,
			'rgb(253,219,199)',
			0.8,
			'rgb(239,138,98)',
			1,
			'rgb(255,201,101)'
		],
		'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 10, 20],
		'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
	}
};

/**
 * Style for the circle layer that shows up after zooming in the map
 */
const pointLayerStyle: CircleLayer = {
	id: 'tweet-point',
	type: 'circle',
	source: 'tweets',
	minzoom: 7,
	paint: {
		'circle-radius': [
			'interpolate',
			['linear'],
			['zoom'],
			7, ['interpolate',
				['linear'],
				['get', 'score'],
				10, 1,
				100, 4,
				1000, 8
			],
			16, ['interpolate',
				['linear'],
				['get', 'score'],
				10, 1,
				100, 50,
				4000, 200
			]
		],
		'circle-color': ['interpolate',
			['linear'],
			['get', 'score'],
			10, 'rgba(33,102,172,0)',
			20, 'rgb(103,169,207)',
			30, 'rgb(209,229,240)',
			40, 'rgb(253,219,199)',
			50, 'rgb(239,138,98)',
			500, 'rgb(178,24,43)',
			1000, 'rgb(255,201,101)'
		],
		'circle-stroke-color': 'white',
		'circle-stroke-width': 1,
		'circle-opacity': ['interpolate',
			['linear'],
			['zoom'],
			7,
			0,
			8,
			1
		]
	}
};

/**
 * Component for the map that is displayed in the Query page.
 */
export class QueryMap extends Component<{ location: any, style: any, onMove: (loc: any) => void }> {
	
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<Map reuseMaps
				initialViewState={{
					longitude: -79.347,
					latitude: 43.651,
					zoom: 5
				}}
				mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
				style={this.props.style}
				mapStyle="mapbox://styles/mapbox/dark-v10">
				<Marker
					longitude={this.props.location.longitude}
					latitude={this.props.location.latitude}
					anchor="bottom"
					draggable
					onDrag={(event: MarkerDragEvent) => {
						this.props.onMove({
							longitude: event.lngLat.lng,
							latitude: event.lngLat.lat
						});
					}}
				>
					<Pin size={20} />
				</Marker>
			</Map>
		);
	}
}

/**
 * Component to display an active query on the map just by using its ID.
 * @param props Properties for the component
 * @param props.id The id of the query
 * @returns The component
 */
export function QueryHeatmap(props: { id: string}) {

	// The state for the popup and the heatmap layer
	const [popupInfo, setPopupInfo] = useState<ITweetPoint | undefined>(undefined);
	const [geojson, setGeoJson] = useState(null);

	// Fetch the geojson data for the query on page load
	useEffect(() => {
		axios(`${process.env.NEXT_PUBLIC_API_URL}/query/${props.id}/geojson`).then(res => {
			if (res.data.status === 200) {
				setGeoJson(res?.data['geojson']);
			}
			else setGeoJson(null);
		}).catch(err => {
			console.log(err);
		});
	}, [props.id]);

	// Memorize the geojson in the state
	const data = useMemo(() => {
		return geojson;
	}, [geojson]);

	return (
		<Map reuseMaps
			initialViewState={{
				longitude: -79.347,
				latitude: 43.651,
				zoom: 5
			}}
			interactiveLayerIds={['tweet-point']}
			mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
			style={{ width: '100%', height: '90vh' }}
			mapStyle="mapbox://styles/mapbox/dark-v10"
			onClick={(event) => {
				// Find the tweet that was clicked and check if it is a point
				const { features } = event;
				if (features !== undefined && features.length > 0) {
					if (features[0].geometry.type === 'Point' && features[0].properties !== null) {
						
						// If it is a point, set the popup info
						const tweet: ITweetPoint = {
							longitude: features[0].geometry.coordinates[0],
							latitude: features[0].geometry.coordinates[1],
							score: features[0].properties.score,
							id: features[0].properties.id
						};

						setPopupInfo(tweet);
					}
					else setPopupInfo(undefined);
				}
				else setPopupInfo(undefined);
			}}>
			{data && (
				<Source id="heatmap" type="geojson" data={data}>
					<Layer {...heatmapLayerStyle} />
					<Layer {...pointLayerStyle} />
				</Source>
			)}
			{popupInfo && (
				<Popup
					longitude={Number(popupInfo.longitude)}
					latitude={Number(popupInfo.latitude)}
					anchor="bottom"
					closeOnClick={true}
					onClose={() => setPopupInfo(undefined)}>
					The algo score is: {popupInfo.score.toFixed(2)}<br />
					<a target='_blank' href={`https://twitter.com/anyuser/status/${popupInfo.id}`} rel='noopener noreferrer' className='text-blue-400 hover:text-blue-300'>Click here</a> to see the tweet.
				</Popup>
			)}
		</Map>
	);
}

/**
 * The default map that is displayed on the dashboard. This will display all active queries and their tweets.
 * Another function is available to display a specific query. This is due to the technical limitations of the MapBox API for styling maps.
 * @returns The component
 */
export default function DashboardMap() {

	// The state for the popup and the heatmap layer
	const [popupInfo, setPopupInfo] = useState<ITweetPoint | undefined>(undefined);
	const [geojson, setGeoJson] = useState(null);

	// Fetch the geojson data for the query on page load
	useEffect(() => {
		axios(`${process.env.NEXT_PUBLIC_API_URL}/queries/active/list/geojson`).then(res => {
			if (res.data.status === 200) {
				setGeoJson(res?.data['geojson']);
			}
			else setGeoJson(null);
		}).catch(err => {
			console.log(err);
		});
	}, []);

	// Memorize the geojson in the state
	const data = useMemo(() => {
		return geojson;
	}, [geojson]);

	return (
		<Map reuseMaps
			initialViewState={{
				longitude: -79.347,
				latitude: 43.651,
				zoom: 5
			}}
			interactiveLayerIds={['tweet-point']}
			mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
			style={{ width: '100%', height: '90vh' }}
			mapStyle="mapbox://styles/mapbox/dark-v10"
			onClick={(event) => {
				// Find the tweet that was clicked and check if it is a point
				const { features } = event;
				if (features !== undefined && features.length > 0) {
					if (features[0].geometry.type === 'Point' && features[0].properties !== null) {
						
						// If it is a point, set the popup info
						const tweet: ITweetPoint = {
							longitude: features[0].geometry.coordinates[0],
							latitude: features[0].geometry.coordinates[1],
							score: features[0].properties.score,
							id: features[0].properties.id
						};

						setPopupInfo(tweet);
					}
					else setPopupInfo(undefined);
				}
				else setPopupInfo(undefined);
			}}>
			{data && (
				<Source id="heatmap" type="geojson" data={data}>
					<Layer {...heatmapLayerStyle} />
					<Layer {...pointLayerStyle} />
				</Source>
			)}
			{popupInfo && (
				<Popup
					longitude={Number(popupInfo.longitude)}
					latitude={Number(popupInfo.latitude)}
					anchor="bottom"
					closeOnClick={true}
					onClose={() => setPopupInfo(undefined)}>
					The algo score is: {popupInfo.score.toFixed(2)}<br />
					<a target='_blank' href={`https://twitter.com/anyuser/status/${popupInfo.id}`} rel='noopener noreferrer' className='text-blue-400 hover:text-blue-300'>Click here</a> to see the tweet.
				</Popup>
			)}
		</Map>
	);
}