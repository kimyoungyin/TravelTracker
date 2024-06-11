"use client";

import { PhotoWithExif } from "@/components/Upload/Steps";
import {
    AdvancedMarker,
    Map,
    MapMouseEvent,
    Pin,
    useMap,
    useMapsLibrary,
} from "@vis.gl/react-google-maps";

interface Props {
    prevPhotoObj: PhotoWithExif;
    currPhotoObj: PhotoWithExif;
    currPhotoPosition: { lat: number; lng: number };
    onChangeCurrPhotoPosition: (ev: MapMouseEvent) => void;
    onDragCurrPhotoPosition: (e: google.maps.MapMouseEvent) => void;
}

export default function PinMovableMap({
    prevPhotoObj,
    currPhotoObj,
    currPhotoPosition,
    onChangeCurrPhotoPosition,
    onDragCurrPhotoPosition,
}: Props) {
    // 하나라면 상관없지만, 여러 개라면 파라미터로 Id 지정
    // const map = useMap();
    // const placesLib = useMapsLibrary("places");
    // const [placesService, setPlacesService] =
    //     useState<google.maps.places.PlacesService | null>(null);

    // useEffect(() => {
    //     if (!map || !placesLib) return;
    //     setPlacesService(new placesLib.PlacesService(map));
    // }, [map, placesLib]);

    // useEffect(() => {
    //     if (!placesService) return;
    //     placesService.textSearch(
    //         {
    //             // location
    //             query: "강동역",
    //         },
    //         (places) => console.log(places)
    //     );
    // }, [placesService]);

    const prevPhotoPosition = {
        lat: prevPhotoObj.latitude!,
        lng: prevPhotoObj.longtitude!,
    };

    return (
        <div className="w-[400px] h-[400px]">
            <Map
                defaultZoom={15}
                defaultCenter={prevPhotoPosition}
                mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_SEARCH_ID}
                onClick={onChangeCurrPhotoPosition}
            >
                <AdvancedMarker position={prevPhotoPosition}>
                    <Pin>
                        <img
                            className="flex-1 aspect-square rounded-full object-cover"
                            width={22}
                            height={22}
                            src={prevPhotoObj.previewUrl}
                            alt=""
                        />
                    </Pin>
                </AdvancedMarker>
                <AdvancedMarker
                    position={currPhotoPosition}
                    draggable
                    onDragEnd={onDragCurrPhotoPosition}
                >
                    {currPhotoPosition !== null && (
                        <Pin background={"#34A853"} borderColor={"#34A853"}>
                            <img
                                className="flex-1 aspect-square rounded-full object-cover"
                                width={22}
                                height={22}
                                src={currPhotoObj.previewUrl}
                                alt=""
                            />
                        </Pin>
                    )}
                </AdvancedMarker>
            </Map>
        </div>
    );
}
