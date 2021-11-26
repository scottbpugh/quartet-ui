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

const defaultLocaleMsg = {
  gtinCalculator: {
    GTINCalculatorTitle: "GTIN Calculator",
    calcPlaceholder: "Enter an NDC code",
    indicatorDigit: "Indicator {indicator}",
    GTINs: "GTINs"
  }
};

const french = {
  GTINCalculatorTitle: "Calculatrice de GTIN",
  calcPlaceholder: "Entrer un code NDC",
  indicatorDigit: "Indicator {indicator}",
  GTINs: "GTINs"
};

export default {
  "en-US": {plugins: {...defaultLocaleMsg}},
  "fr-FR": {
    plugins: {
      gtinCalculator: {
        ...defaultLocaleMsg.gtinCalculator,
        ...french
      }
    }
  }
};
