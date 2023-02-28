import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import Notification from "./components/UI/Notification";
import { uiActions } from "./store/ui-slice";

let isInitial = true;

function App() {
  const dispatch = useDispatch();

  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);

  useEffect(() => {
    const sendCartData = async () => {
      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "Sending...",
          message: "Sending cart data.",
        })
      );

      try {
        const response = await fetch(
          "https://tutreacttwo-default-rtdb.europe-west1.firebasedatabase.app/cart.json",
          {
            method: "PUT",
            body: JSON.stringify(cart), //to JSON
          }
        );

        if (!response.ok) {
          throw new Error("Sending cart data failed!");
        }

        dispatch(
          uiActions.showNotification({
            status: "success",
            title: "Success!",
            message: "Successfully sent cart data!",
          })
        );
      } catch (error) {
        dispatch(
          uiActions.showNotification({
            status: "error",
            title: "Error!",
            message: "Something went wrong; " + error.message,
          })
        );
      }
    };

    if (isInitial) {
      isInitial = false;
      return;
    }

    sendCartData();
  }, [cart, dispatch]);

  return (
    <Fragment>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
