import { useEffect, useRef } from "react";
import type { LocationDef } from "@/game/data";
import { getLocale, t, tLoc, useT } from "@/game/i18n";
import type { GameState } from "@/game/types";

const HOME = "#c4bdb3";
const CLEAR = "#6a8a5a";
const DANGER = "#9a3b32";

export function UsMap({
  state,
  visible,
  selected,
  onSelect,
}: {
  state: GameState;
  visible: LocationDef[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  useT();
  const locale = getLocale();
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const fitted = useRef(false);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const visibleRef = useRef(visible);
  visibleRef.current = visible;
  const stateRef = useRef(state);
  stateRef.current = state;
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  useEffect(() => {
    let dead = false;
    const el = elRef.current;
    if (!el) return undefined;
    (async () => {
      const L = await import("leaflet");
      if (dead || !elRef.current) return;
      const host = elRef.current;
      if ("_leaflet_id" in host) {
        try {
          (host as unknown as { _leaflet_id?: number })._leaflet_id = undefined;
        } catch {
          /* already tearing down */
        }
      }
      const map = L.map(host, {
        center: [38.15, -86.2],
        zoom: 7,
        minZoom: 4,
        maxZoom: 12,
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: true,
      });
      map.setMaxBounds(L.latLngBounds(L.latLng(24.2, -125.2), L.latLng(49.6, -66.4)));
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OSM &copy; CARTO",
        subdomains: "abcd",
        maxZoom: 12,
      }).addTo(map);
      L.control.zoom({ position: "topright" }).addTo(map);
      const layer = L.layerGroup().addTo(map);
      mapRef.current = map;
      layerRef.current = layer;
      draw(L);
      map.whenReady(() => {
        map.invalidateSize();
        draw(L);
      });
    })();
    return () => {
      dead = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  function draw(L: typeof import("leaflet")) {
    const map = mapRef.current;
    const layer = layerRef.current;
    const st = stateRef.current;
    const vis = visibleRef.current;
    const sel = selectedRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    const pts: [number, number][] = [];
    for (const loc of vis) {
      const ls = st.locations[loc.id];
      const home = loc.id === st.shelter.locationId;
      const color = home ? HOME : ls.zombies > 0 ? DANGER : CLEAR;
      const marker = L.circleMarker([loc.lat, loc.lng], {
        radius: sel === loc.id ? 9 : home ? 8 : 6,
        color: sel === loc.id ? HOME : color,
        weight: sel === loc.id ? 2 : 1,
        fillColor: color,
        fillOpacity: 0.92,
      });
      const status = home ? t("map.home") : ls.zombies > 0 ? t("map.zombies", { n: ls.zombies }) : t("map.cleared");
      marker.bindTooltip(`${tLoc(loc.id)}<br>${t(`state.${loc.region}`)} · ${status}`, {
        direction: "top",
        opacity: 0.92,
        className: "ash-map-tip",
      });
      if (!home) marker.on("click", () => onSelectRef.current(loc.id));
      marker.addTo(layer);
      pts.push([loc.lat, loc.lng]);
    }
    if (pts.length >= 2 && !fitted.current) {
      map.fitBounds(L.latLngBounds(pts).pad(0.4), { maxZoom: 8, animate: false });
      fitted.current = true;
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = await import("leaflet");
      if (cancelled) return;
      draw(L);
      if (selected) {
        const loc = visible.find((l) => l.id === selected);
        if (loc && mapRef.current) {
          mapRef.current.flyTo([loc.lat, loc.lng], Math.max(mapRef.current.getZoom(), 8), { duration: 0.4 });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [visible, selected, state.shelter.locationId, state.locations, locale]);

  return (
    <div className="relative h-[min(52dvh,420px)] overflow-hidden rounded-lg border border-border bg-surface">
      <div ref={elRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute left-2 top-2 z-[400] rounded-sm bg-bg/75 px-2 py-1 text-[10px] tracking-wide text-muted">
        {t("map.live")}
      </div>
      <div className="pointer-events-none absolute bottom-8 left-2 z-[400] flex gap-2 text-[10px] text-muted">
        <span className="inline-flex items-center gap-1">
          <i className="inline-block size-2 rounded-full" style={{ background: HOME }} />
          {t("map.homeShort")}
        </span>
        <span className="inline-flex items-center gap-1">
          <i className="inline-block size-2 rounded-full" style={{ background: DANGER }} />
          {t("map.open")}
        </span>
        <span className="inline-flex items-center gap-1">
          <i className="inline-block size-2 rounded-full" style={{ background: CLEAR }} />
          {t("map.cleared")}
        </span>
      </div>
    </div>
  );
}
