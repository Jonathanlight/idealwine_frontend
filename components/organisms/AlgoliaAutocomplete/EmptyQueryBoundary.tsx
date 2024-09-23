import { useInstantSearch } from "react-instantsearch-hooks-web";

const EmptyQueryBoundary = ({
  children,
  fallback,
}: {
  children: JSX.Element;
  fallback: JSX.Element | null;
}): JSX.Element | null => {
  const { indexUiState } = useInstantSearch();

  if (indexUiState.query == null) {
    return fallback;
  }

  return children;
};

export default EmptyQueryBoundary;
