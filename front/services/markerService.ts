import mapboxgl from "mapbox-gl";
import type { Event } from "@/types/event";

export const addMarkers = (
  map: mapboxgl.Map,
  events: Array<Event>,
  onMarkerClick: (event: Event) => void
) => {
  events.forEach((event) => {
    if (event.longitude && event.latitude) {
      const markerColor =
        parseFloat(event.price.toString()) === 0.0 ? "blue" : "red";

      const markerElement = document.createElement("div");
      markerElement.style.backgroundColor = markerColor;
      markerElement.style.width = "15px";
      markerElement.style.height = "15px";
      markerElement.style.borderRadius = "50%";
      markerElement.style.border = "2px solid white";

      const marker = new mapboxgl.Marker({ element: markerElement })
        .setLngLat([event.longitude, event.latitude])
        .addTo(map);

      marker.getElement().addEventListener("click", () => {
        onMarkerClick(event);
      });
    }
  });
};
