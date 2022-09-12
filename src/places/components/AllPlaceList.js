import React from "react";
import Card from "../../shared/components/UIElements/Card";
import { useStateContext } from "../../shared/context/auth-context";
import "./PlaceList.css";
import PlaceItem from "./PlaceItem";
import AllPlaceItem from "./AllPlaceItem";
import Button from "../../shared/components/FormElements/Button";


const AllPlaceList = ({items}) => {
    const {isLoggedIn} = useStateContext();
    if (items.length === 0) {
      return (
        <div className="place-list center">
          <Card>
           {
            isLoggedIn ? <>
            <h2> No places found. May be create one?</h2>
            <Button to='/places/new'>Share Place</Button>
           </> :<>
            <h2> No places found. May be create one?</h2>
            <Button to='/auth'>sign In / sign up and share</Button>
           </>
           }
          </Card>
        </div>
      );
    }
  return (
    <ul className="place-list">
      {items.map((place) => (
        <AllPlaceItem
          key={place._id}
          id={place._id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
        />
      ))}
    </ul>
  )
}

export default AllPlaceList