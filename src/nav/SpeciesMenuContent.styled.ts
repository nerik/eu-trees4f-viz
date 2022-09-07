import styled from 'styled-components'

export const Aside = styled.aside`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 4rem;
  max-width: 35%;
  margin-right: 2rem;

  & > p {
    line-height: 4rem;
    margin: 0;
  }

  & > b {
    display: block;
    font-family: ${({ theme }) => theme.fonts.serifBold};
    font-size: 8rem;
    margin: 3.5rem 0 1.5rem 0;
  }
`

interface SpeciesButtonProps {
  readonly color: string
}

export const SpeciesButton = styled.button<SpeciesButtonProps>`
  display: block;
  border-left: 4px solid ${({ color }) => color};
  color: ${({ theme }) => theme.colors.light};
  text-align: left;
  text-transform: capitalize;
  height: 34px;
  font-size: ${({ theme }) => theme.fontSizes.small};
  line-height: 0.8rem;

  &:disabled {
    opacity: 0.3;
  }

  & > b {
    display: block;
    font-weight: normal;
    /* backdrop-filter: blur(10px); */
  }

  /* & > i {
  backdrop-filter: blur(10px);
  display: block;
  opacity: 0.7;
} */
`
