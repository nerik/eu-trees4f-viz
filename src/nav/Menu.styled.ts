import styled from 'styled-components'

interface MenuContentsProps {
  readonly strategy: string
}

export const MenuContents = styled.div<MenuContentsProps>`
  position: ${({ strategy }) => strategy};
  top: ${({ theme }) => theme.layout.navHeight};
  left: 0;
  width: 100%;
  background: ${({ theme }) => theme.colors.dark};
  z-index: 99;
`

export const MenuTools = styled.div`
  height: ${({ theme }) => theme.layout.navHeight};
  display: flex;
  justify-content: right;
  align-items: center;
  background: ${({ theme }) => theme.colors.background};
  padding: 1rem;

  & > *:not(:last-child) {
    padding-right: 4rem;
  }

  & label {
    font-weight: bold;
    font-size: ${({ theme }) => theme.fontSizes.small};
    margin-right: 1rem;
  }
`

export const SortByButton = styled.button`
  width: 250px;
  background: ${({ theme }) => theme.colors.light};
  color: ${({ theme }) => theme.colors.dark};
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.small};
  padding: 0.6rem 2rem 0.6em 1rem;
  border-radius: 99px;
  position: relative;

  &::after {
    position: absolute;
    right: 0.8rem;
    bottom: 0.2rem;
    content: '↡';
    font-size: 1.4rem;
    font-weight: normal;
  }
`

export const SortByList = styled.ul`
  /* position: absolute; */
  width: 230px;
  background: ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.fontSizes.small};
  text-align: center;
  z-index: 2;
  cursor: pointer;

  & > li:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.lightFaded};
  }
`

export const Search = styled.input`
  width: 230px;
  border: 0;
  background: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.dark};
  font-size: ${({ theme }) => theme.fontSizes.small};

  &::placeholder {
    font-style: italic;
    color: ${({ theme }) => theme.colors.dark};
    opacity: 0.5;
  }

  &:focus {
    outline: none;
    border-bottom-width: 2px;
  }
`
