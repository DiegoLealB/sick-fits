import React from "react";
import { useCombobox } from "downshift";
import Router from "next/router";
import { ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import debounce from "lodash.debounce";
import { DropDown, DropDownItem, SearchStyles } from "./styles/DropDown";

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(
      where: {
        OR: [
          { title_contains: $searchTerm }
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      image
      title
    }
  }
`;

function routeToItem(item) {
  Router.push({
    pathname: "/item",
    query: {
      id: item.id,
    },
  });
}

function AutoComplete() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState("false");

  const onChange = debounce(async (e, client) => {
    setLoading(true);
    const response = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: e.target.value },
    });
    setItems(response.data.items);
    setLoading(false);
  }, 350);

  const {
    isOpen,
    selectedItem,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    inputValue,
  } = useCombobox({
    items,
    onInputValueChange: ({ inputValue }) => {
      setItems(
        items.filter((item) =>
          item.title.toLowerCase().startsWith(inputValue.toLowerCase())
        )
      );
    },
  });

  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <ApolloConsumer>
          {(client) => (
            <input
              {...getInputProps({
                type: "search",
                placeholder: "Search For An Item",
                id: "search",
                className: loading ? "loading" : "",
                onChange: (e) => {
                  e.persist();
                  onChange(e, client);
                },
              })}
            />
          )}
        </ApolloConsumer>
        {isOpen && (
          <DropDown {...getMenuProps()}>
            {items.map((item, index) => (
              <DropDownItem {...getItemProps({ item })} key={item.id}>
                <img width="50" src={item.image} alt={item.title} />
                {item.title}
              </DropDownItem>
            ))}
            {!items.length && !loading && (
              <DropDownItem> Nothing Found {inputValue}</DropDownItem>
            )}
          </DropDown>
        )}
      </div>
    </SearchStyles>
  );
}

export default AutoComplete;
