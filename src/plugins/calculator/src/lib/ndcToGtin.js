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

/**
 * Generates a check digit based on inbound character
 * strings for a given SSCC-18 or GTIN-14 barcode.
 *
 * @param barcode The first 13 characters or the
 * first 17 characters of an SSCC-18 or GTIN-14.
 */
export function mod10CheckDigit(barcode) {
  var totalOdd = 0;
  var totalEven = 0;
  var total = 0;
  // get the odd numbers
  for (var i = 0; i < barcode.length; i += 2) {
    var char = barcode.substr(i, 1);
    totalOdd += +char * 3;
  }
  // get the even numbers
  for (var i = 1; i < barcode.length; i += 2) {
    var char = barcode.substr(i, 1);
    totalEven += +char * 1;
  }
  total = totalOdd + totalEven;
  // see if this is a multiple of 10
  var near = Math.ceil(total / 10) * 10;
  console.debug(near);
  return Math.ceil(total / 10) * 10 - total;
}

/**
 * Converts an FDA NDC value into a valid GTIN14.
 * @param ndc An NDC with or without dashes- should always be 12 digits
 * with dashes or 10 digits without.
 */
export function NDCtoGTIN14(ndc, indicator) {
  // strip out the dashes and any white space
  var gtin = ndc.replace(/-/g, "").trim();
  gtin = indicator + "03" + gtin;
  var checkDigit = mod10CheckDigit(gtin);
  return "" + gtin + checkDigit;
}
//document.body.innerHTML = NDCtoGTIN14("99999-988-99", "1");
