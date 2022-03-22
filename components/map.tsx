import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { HeatmapLayer, CircleLayer, Layer, Popup, Source, MarkerDragEvent, Marker } from 'react-map-gl';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Pin from '../components/pin';

interface ITweetPoint {
	longitude: any;
	latitude: any;
	score: number;
	id: string;
}

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
			0.9,
			'rgb(255,201,101)'
		],
		'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 10, 20],
		'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
	}
};

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

export function NewQueryMap({onMove}: {onMove: (e: any) => void}) {

	const [marker, setMarker] = useState({
		longitude: -79.347,
		latitude: 43.651,
	});

	const onMarkerDrag = useCallback((event: MarkerDragEvent) => {
        onMove({
			longitude: event.lngLat.lng,
			latitude: event.lngLat.lat
		});

		setMarker({
			longitude: event.lngLat.lng,
			latitude: event.lngLat.lat
		});
	}, []);

	return (
		<Map reuseMaps
			initialViewState={{
				longitude: -79.347,
				latitude: 43.651,
				zoom: 5
			}}
			mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
			style={{ width: '90%', height: '70vh' }}
			mapStyle="mapbox://styles/mapbox/dark-v10">
			<Marker
				longitude={marker.longitude}
				latitude={marker.latitude}
				anchor="bottom"
				draggable
				onDrag={onMarkerDrag}
			>
				<Pin size={20} />
			</Marker>
		</Map>
	);
}

function DashboardMap() {

	const [popupInfo, setPopupInfo] = useState<ITweetPoint | undefined>(undefined);
	const [geojson, setGeoJson] = useState(null);

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
				const { features } = event;
				if (features !== undefined && features.length > 0) {
					if (features[0].geometry.type === 'Point' && features[0].properties !== null) {
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

export default DashboardMap;