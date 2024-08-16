import { AttributifyAttributes } from 'windicss/types/jsx'

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface HTMLAttributes extends AttributifyAttributes {}
}
