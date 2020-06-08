import * as React from "react";
import { Beer } from "../types";

export interface BeerDisplayerProps {
  beers: Beer[];
  setIsModalOpen: Function;
  setModalContent: Function;
}

const BeerDisplayer: React.SFC<BeerDisplayerProps> = ({
  beers,
  setIsModalOpen,
  setModalContent,
}) => {
  return (
    <div>
      <div id="beer-table-heading">
        <h2>Beer List</h2>
        <button
          onClick={() => {
            setModalContent("newBeerForm");
            setIsModalOpen(true);
          }}
        >
          Add
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th className="column1">ABV</th>
            <th>Brewer</th>
            <th>Description</th>
            <th>Name</th>
            <th>Type</th>
            <th className="column6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {beers.map((beer: Beer) => (
            <tr key={beer._id}>
              <td className="column1">{beer.abv}</td>
              <td>{beer.brewer}</td>
              <td>{beer.description}</td>
              <td>{beer.name}</td>
              <td>{beer.type}</td>
              <td className="column6 action-column">
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BeerDisplayer;
