import { connector, type ContainerProps } from "./global_footer.container"

export function Wrapper(props: ContainerProps) {
  return <footer></footer>
}

export const GlobalFooter = connector(Wrapper)
