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

export class SingleMarkerMap extends Component {
  componentDidMount() {
    console.log("triggered");
    let delay = 0;
    if (this.props.delay) {
      delay = Number(this.props.delay);
    }
    window.setTimeout(() => {
      this.setUpMap();
      this.setMarkers(this.props.markerLocation);
      this._map.setTarget(this.props.targetId);
    }, delay);
  }
  componentWillUnmount() {
    this._map = null;
  }
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      this.setMarkers(nextProps.markerLocation);
    }
  }
  setMarkers(markerLocation) {
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

    let f = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat(this.props.markerLocation)
      ),
      name: "Location" + this.props.targetId,
      id: "location" + this.props.targetId
    });

    let vectorSource = new ol.source.Vector({features: [f]});
    if (this._vectorLayer) {
      //this._map.removeLayer(this._vectorLayer);
    }

    let vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: iconStyle
    });
    this._vectorLayer = vectorLayer;
    this._map.addLayer(this._vectorLayer);
    this._map.getView().fit(vectorSource.getExtent(), false);
  }
  setUpMap() {
    this._map = new ol.Map({
      layers: [new ol.layer.Tile({source: new ol.source.OSM()})],
      view: new ol.View({
        center: ol.proj.fromLonLat(this.props.markerLocation),
        zoom: 1,
        maxZoom: 12,
        minZoom: 1
      })
    });
  }
  render() {
    return (
      <div
        id={this.props.targetId}
        style={
          this.props.size ? this.props.size : {height: "150px", width: "200px"}
        }
      />
    );
  }
}
