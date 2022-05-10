import { styled } from '@stitches/react';

const Button = styled('button', {
    backgroundColor: 'lightgray',
    borderRadius: '2px',
    fontSize: '13px',
    padding: '6px 24px',
    margin: '6px',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'darkgray',
    },
  });

  export default Button;