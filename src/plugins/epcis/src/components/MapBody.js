// Copyright (c) 2018 SerialLab Corp.
//
// GNU GENERAL PUBLIC LICENSE
//    Version 3, 29 June 2007
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, {Component} from "react";
import "openlayers/dist/ol.css";

var ol = require("openlayers/dist/ol.js");

class _MapBody extends Component {
  componentDidMount() {
    // setting on mount
    this.setUpMap();
    this._map.setTarget("map");
  }
  componentWillUnmount() {
    this._map.removeEventListener("click"); // remove click listener.
    this._map.removeEventListener("pointermove");
    this._map = null;
  }
  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(this.props.geoEvents) !==
      JSON.stringify(nextProps.geoEvents)
    ) {
      // don't modify state here, modify the classic dom-based map (yay!)
      this.setMarkers(nextProps.geoEvents);
    }
  }
  setMarkers(geoEvents) {
    let newMarkers = [];
    //create the style
    var iconStyle = new ol.style.Style({
      image: new ol.style.Icon(
        /** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 1],
          anchorOrigin: "bottom-right",
          scale: 0.4,
          anchorXUnits: "fraction",
          anchorYUnits: "pixels",
          opacity: 0.9,
          src: "https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon-2x.png"
        })
      )
    });
    // populate newMarkers array
    geoEvents.forEach(event => {
      if (event.longitude && event.latitude) {
        newMarkers.push({
          longitude: event.longitude,
          latitude: event.latitude,
          id: event.id
        });
      }
    });
    // deduplicate newMarkers
    newMarkers = newMarkers.filter(
      (marker, index, self) =>
        index ===
        self.findIndex(
          m =>
            m.longitude === marker.longitude && m.latitude === marker.latitude
        )
    );
    let iconFeatures = newMarkers.map((marker, index) => {
      let f = new ol.Feature({
        geometry: new ol.geom.Point(
          ol.proj.fromLonLat([
            Number(marker.longitude),
            Number(marker.latitude)
          ])
        ),
        name: "Event" + index,
        id: marker.id
      });
      return f;
    });
    if (iconFeatures.length > 0) {
      let vectorSource = new ol.source.Vector({features: iconFeatures});
      if (this._vectorLayer) {
        this._map.removeLayer(this._vectorLayer);
      }

      let vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: iconStyle
      });
      this._vectorLayer = vectorLayer;
      this._map.addLayer(this._vectorLayer);
      this._map.getView().fit(vectorSource.getExtent(), false);
    }
  }
  setUpMap() {
    this._map = new ol.Map({
      layers: [new ol.layer.Tile({source: new ol.source.OSM()})],
      view: new ol.View({
        center: ol.proj.fromLonLat([-5.165733, 29.906098]),
        zoom: 1,
        maxZoom: 15,
        minZoom: 1
      })
    });
    this._map.on("click", e => {
      this._map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
        if (feature.get("id") && document.getElementById(feature.get("id"))) {
          var top = document.getElementById(feature.get("id")).offsetTop; //Getting Y of target element
          window.scrollTo(0, top);
        }
      });
    });
    this._map.on("pointermove", function(evt) {
      var hit = this.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        return true;
      });
      if (hit) {
        this.getTargetElement().style.cursor = "pointer";
      } else {
        this.getTargetElement().style.cursor = "";
      }
    });
    this.setMarkers(this.props.geoEvents ? this.props.geoEvents : []);
  }
  render() {
    return (
      <div
        id="map"
        style={{height: "250px"}}
        className={this.props.active ? "active_map" : "inactive_map"}
      />
    );
  }
}

export const MapBody = _MapBody;
