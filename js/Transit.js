import React, {Component} from 'react';
import * as RL from 'react-leaflet';

export function mapAllStationsSorted(stationsObj, fn) {
  var stationsArr = [];
  for (var key in stationsObj) {
    stationsArr.push(stationsObj[key]);
  }

  stationsArr.sort((sa, sb) => sa.lines.length - sb.lines.length);

  return stationsArr.map(fn);
}

export function buildTransitData(lines) {
  var stations = {};

  lines.map(line => {
    line.stops.map( node => {
      if (node.name) { // is a station, not just a corner
        if (!(node.name in stations)) {
          stations[node.name] = node;
          stations[node.name].lines = [];
        }
        stations[node.name].lines.push(line);
      }
    });
  });

  return {
    lines: lines,
    stations: stations,
  };
}

export class TransitLine extends Component {
  render() {
    var line = this.props.line;
    var dashArray = null;
    if (line.kind == "planned")
      dashArray = [10];

    // TODO list stops in popup
    return <RL.Polyline
      title={line.name}
      positions={line.stops.map(n => [n.pos[2] + .5, n.pos[0] + .5])}
      weight={5}
      color={line.color || '#f0f'}
      dashArray={dashArray}
    >
        <RL.Popup><span>
          {line.name || "unnamed"} ({line.kind})
        </span></RL.Popup>
      }
    </RL.Polyline>;
  }
}

export class TransitStation extends Component {
  render() {
    var station = this.props.station;
    var [x, y, z] = station.pos;

    var style = {color: 'black', fillColor: 'white', radius: 7};
    var firstLine = station.lines[0];
    if (station.lines.length == 1
        && station.name != firstLine.stops[0].name
        && station.name != firstLine.stops[firstLine.stops.length - 1].name) {
      // just a stop
      style = {color: firstLine.color, fillColor: 'white', radius: 6};
    }

    return <RL.CircleMarker
      title={station.name}
      center={[z + .5, x + .5]}
      weight={2}
      fillOpacity={1}
      {...style}
    >
      <RL.Popup><span>
        {station.name}
        <br />
        {x} {y} {z}
      </span></RL.Popup>
    </RL.CircleMarker>
  }
}
