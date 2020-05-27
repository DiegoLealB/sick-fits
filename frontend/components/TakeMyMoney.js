import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { Mutation } from "react-apollo";
import Router from "next/router";
import NProgress from "nprogress";
import gql from "graphql-tag";
import calcTotalPrice from "../lib/calcTotalPrice";
import Error from "./ErrorMessage";
import User, { CURRENT_USER_QUERY } from "./User";

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

class TakeMyMoney extends React.Component {
  totalItems = (cart) => {
    return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
  };

  onToken = (res, createOrder) => {
    createOrder({
      variables: {
        token: res.id,
      },
    }).catch((err) => {
      alert(err.message);
    });
  };

  render() {
    return (
      <User>
        {({ loading, data }) => (
          <Mutation
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={[{ query: CURRENT_USER_QUERY }]}
          >
            {(createOrder) =>
              loading ? null : (
                <StripeCheckout
                  amount={calcTotalPrice(data.me.cart)}
                  name="Sick Fits"
                  description={`Order of ${this.totalItems(data.me.cart)}`}
                  image={data.me.cart[0].item && data.me.cart[0].item.image}
                  stripeKey="pk_test_9LmMMGbk85mFi4TvlGdZRB7600SlqZMt1n"
                  currency="USD"
                  email={data.me.email}
                  token={(res) => this.onToken(res, createOrder)}
                >
                  {console.log(data)}
                </StripeCheckout>
              )
            }
          </Mutation>
        )}
      </User>
    );
  }
}

export default TakeMyMoney;
