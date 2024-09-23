import { useRef, useState } from "react";
import { useSearchBox } from "react-instantsearch-hooks-web";

type CustomSearchBoxProps = {
  setIsFocused: (value: boolean) => void;
  placeholder: string;
  classNames?: { [key: string]: string };
};

const CustomSearchBox = ({ setIsFocused, placeholder, classNames }: CustomSearchBoxProps) => {
  const { query, refine } = useSearchBox();
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  const setQuery = (newQuery: string) => {
    setInputValue(newQuery);
    refine(newQuery);
  };

  return (
    <div>
      <form
        action=""
        role="search"
        noValidate
        onSubmit={event => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <input
          className={classNames?.input}
          ref={inputRef}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          maxLength={512}
          type="text"
          value={inputValue}
          onChange={event => {
            setQuery(event.currentTarget.value);
          }}
        />
      </form>
    </div>
  );
};

export default CustomSearchBox;
