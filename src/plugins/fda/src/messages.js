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
  fda: {
    FDALookup: "FDA Lookup",
    manufacturerName: "Manufacturer Name",
    brandName: "Brand Name",
    genericName: "Generic Name",
    packageNdc: "Package NDC",
    productNdc: "Product NDC",
    effectiveDate: "Effective Date",
    generateTradeItem: "Generate Trade Item",
    generateTradeItems: "Generate Trade Item(s)",
    fdaProvidedNDC: "The FDA-provided NDC",
    indicatorDigit: "Indicator Digit",
    next: "next",
    previous: "previous"
  }
};

const french = {
  FDALookup: "Recherche FDA",
  manufacturerName: "Nom du fabricant",
  brandName: "Marque",
  genericName: "Nom générique",
  packageNdc: "NDC paquet",
  productNdc: "NDC produit",
  effectiveDate: "Date effective",
  generateTradeItem: "Créer un article commercial",
  generateTradeItems: "Créer article commerciaux",
  fdaProvidedNDC: "NDC FDA",
  indicatorDigit: "Chiffre indicateur",
  next: "suivant",
  previous: "précedent"
};

export default {
  "en-US": {plugins: {...defaultLocaleMsg}},
  "fr-FR": {
    plugins: {
      fda: {
        ...defaultLocaleMsg.fda,
        ...french
      }
    }
  }
};
