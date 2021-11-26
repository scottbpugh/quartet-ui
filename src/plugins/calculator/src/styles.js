/* Copyright (c) 2018 Serial Lab

GNU GENERAL PUBLIC LICENSE
   Version 3, 29 June 2007

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>. */

export default `
/* Auto-sized cards */
.calculator-cards-container {
  display: flex;
  flex-wrap:wrap;
  margin:0;
  padding:0;
  justify-content:flex-start;
  align-items:flex-start;
}

.calculator-cards-container > * {
  margin:10px 30px;
  padding-top: 80px;
  display: flex;
  width:400px;
  flex-direction:column;
  align-self: flex-start;
  position:relative;
}

.calculator-cards-container h5 {
  background: #EEE;
  top:0;
  position: absolute;
  width: 100%;
  left:0;
  border-radius: 0;
  margin-bottom:20px;
  border-top-left-radius:4px;
  border-top-right-radius:4px;
}
.pt-dark .calculator-cards-container h5 {
  background: #293742;
}
`;
