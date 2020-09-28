import React from 'react';
import firebase from './firebase';
import ToggleDisplay from 'react-toggle-display';
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {faShoppingCart,faStar,faCodeBranch,faTrash,faTimes} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./App.css";

//IMPORTING OF OTHER COMPONENTS
import Nav from "./components/Nav.js";
import Header from './components/Header.js';
import Wishlist from './Wishlist.js';
import Footer from './components/Footer.js';

library.add(fab, faShoppingCart, faStar, faCodeBranch, faTrash, faTimes);


class App extends React.Component {
  constructor() {
    super();

    this.state = {
      wallpapers: [],
      wishlist: [],
      show: false,
      showFave: false,
    }
  }

  componentDidMount() {
    //get wallpaper information from database
    const dbRef = firebase.database().ref();

    dbRef.on("value", (response) => {
      const toSetState = [];
      const data = response.val();

      for (let key in data.wallpapers) {
        toSetState.push({
          item: data.wallpapers[key],
          key: key,
        });
      }

      this.setState({
        wallpapers: toSetState,
      });
    });

    //get wishlist information from database
    const dbRefWishlist = firebase.database().ref("wishlistItems");

    dbRefWishlist.on("value", (response) => {
      const toSetState = [];
      const data = response.val();

      for (let key in data) {
        toSetState.push({
          key: key,
          item: data[key].item,
        });
      }

      this.setState({
        wishlist: toSetState,
      });
    });
  }

  //create a function that adds an item to the wishlist, when a user clicks the "add to wishlist" button
  addItem = (wishlistItem) => {
    const dbRef = firebase.database().ref("wishlistItems");

    dbRef.push(wishlistItem);
    // TODO add if statement, maybe have to use filter?!
  };

  // create a function to remove items from the wishlist + firebase when the user clicks the "garbage can" button
  removeItem = (itemToBeRemoved) => {
    console.log(itemToBeRemoved);

    const dbRef = firebase.database().ref("wishlistItems");
    dbRef.child(itemToBeRemoved).remove();

  };

  wishlistToggle = () => {
    this.setState({
      show: !this.state.show,
    });

    console.log(this.state.show);
  };


  render() {
    return (
      <div className="App">
        
        <Nav toggleList={this.wishlistToggle} />
       
        <header id="home">
        
          <div className="flex-container wrapper">

           <Header />

            <ToggleDisplay show={this.state.show}>

              <section className="wishlist">

                <div className="wishlist-header">

                  <button onClick={() => this.wishlistToggle()}>
                    <p className="sr-only">Close the wishlist by clicking here</p>
                    <FontAwesomeIcon icon='times' />
                  </button>

                  <h2>Wishlist</h2>

                </div>

                <ul>

                  {this.state.wishlist.map((listItem) => {
                    return (

                      <Wishlist
                        name={listItem.item.title}
                        imageSrc={listItem.item.src}
                        imageAlt={listItem.item.alt}
                        removeItem={() => {
                          this.removeItem(listItem.key);
                        }}
                        key={listItem.key}
                        trash={faTrash}
                      />

                    );
                  })}
                </ul>

              </section>
            </ToggleDisplay>

          </div>
        </header>

        <div className="items" id="shop">
          <div className="wrapper">
            <h2>Meet the Doodles</h2>
            <p>digital wallpapers drawn by hand + shot on 35mm film</p>

            <ul>
              {this.state.wallpapers.map((wallpaper) => {
                return (
                  <li key={wallpaper.key}>
                    <div className="item">
                      <div className="item-img">

                        <img
                          src={wallpaper.item.src}
                          alt={wallpaper.item.alt}
                        />
{/* 
                        <ToggleDisplay show={this.state.showFave.state} >
                          <p className="star-sticker">
                            <FontAwesomeIcon icon="star" />
                          </p>
                        </ToggleDisplay> */}

                      </div>
                      <p>{wallpaper.item.title}</p>
                      <p>$5.00</p>
                    </div>

                    <button
                      onClick={() => {
                        this.addItem(wallpaper, wallpaper.key)}} 
                    >
                      Add to wishlist
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default App;



