import * as React from 'react';
import { FormEvent, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchValue } from '@store';
import { Keyboard } from '../../virtual-keyboard';
import './search.css';

export const Search = () => {
  const dispatch = useDispatch();
  const setSearch = (evt: FormEvent) => {
    const target = evt.target as HTMLFormElement;
    dispatch(setSearchValue(target.value));
  };

  useEffect(() => {
    Keyboard.init();
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyboardOpen = () => {
    if (!inputRef.current) {
      return;
    }

    try {
      Keyboard.open(inputRef.current.value, undefined, undefined, inputRef.current);
    } catch (error) {}
  };

  return (
    <div className="search">
      <h3>Country Search</h3>
      <div className="search__controls">
        <input type="text" onInput={setSearch} ref={inputRef} />
        <button className="search__keyboard-button" onClick={() => handleKeyboardOpen()}>
          <i className="material-icons">keyboard</i>
        </button>
      </div>
    </div>
  );
};
