import { InputBase, IconButton, Paper, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { onEnterKey } from '../../lib/keyboard';
import { Styles } from '../../domain/types';
import { toArray } from '../../lib/array';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { RefObject, useCallback, useRef } from 'react';

type TextSearchButtonParam = {
  sx?: Styles;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  text?: string | null;
  onChange: (text?: string) => void;
  onSearch: () => void;
  autoFocus?: boolean;
  searchRef?: RefObject<HTMLInputElement>;
};

function TextSearchButton({
  sx,
  className,
  disabled,
  required,
  placeholder = 'Search',
  text = '',
  onChange,
  onSearch,
  autoFocus,
  searchRef,
}: TextSearchButtonParam) {
  // console.log(`[TextSearchButton] autoFocus = ${autoFocus}`);
  const inputRefTmp = useRef<HTMLInputElement>(null);
  const inputRef = searchRef ?? inputRefTmp;
  // const inputRef = useRef<HTMLInputElement>(null);
  const handleDelete = useCallback(() => {
    inputRef.current?.focus();
    onChange('');
  }, [inputRef, onChange]);
  return (
    <Paper
      className={`text-search-button ${className ?? ''}`}
      sx={[{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }, ...toArray(sx)]}
    >
      <IconButton sx={{ p: '10px' }} aria-label="clear" onClick={handleDelete}>
        <DeleteOutlinedIcon />
      </IconButton>
      <InputBase
        inputRef={inputRef}
        required={required}
        disabled={disabled}
        sx={{ flex: 1 }}
        placeholder={placeholder}
        inputProps={{ 'aria-label': placeholder }}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        onKeyUp={(e) => onEnterKey(onSearch, e)}
        autoFocus={autoFocus}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton onClick={onSearch} color="primary" sx={{ p: '10px' }} aria-label="directions">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

export default TextSearchButton;
